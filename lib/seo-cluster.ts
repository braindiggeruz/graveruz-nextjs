/**
 * Lightweight clustering utilities for the SEO admin dashboards.
 *
 * Used by:
 *   - /admin-tools/cannibalization/  → groups blog posts by title overlap
 *   - /admin-tools/coverage/         → RU↔UZ matching
 *   - /admin-tools/seo-cockpit/ FocusCard → linking suggestions
 *
 * No external deps. Pure functions. Safe for the Cloudflare runtime.
 */

const STOPWORDS = new Set([
  // RU
  'и','в','на','с','по','для','от','до','из','за','к','о','об','при','что','как','то','же','уже','или','но','а','без','над','под','между',
  'это','эта','этот','эти','тот','та','те','такой','такая','такие','своих','свой','своя','свои','наш','наша','наши','наш',
  'кто','что','где','когда','куда','чтобы','если','хотя','также','уже','ещё','еще','есть','быть','был','была','были',
  'один','одна','одно','одни','два','три','много','мало','очень','более','менее','лучше','хуже','просто','часто','редко',
  'не','ни','да','нет','же','ли','бы','б','же','ну','вот','тут','там','здесь','там','туда','сюда',
  // UZ Latin common stop tokens
  'va','bilan','uchun','yoki','ammo','lekin','agar','chunki','shu','bu','u','men','sen','biz','siz','ular','bor','yoq','yo','ham','ham',
  'qanday','qachon','qayer','qaerga','qaerda','nima','kim','nechta','qancha','qanaqa','qaysi',
  // EN
  'the','a','an','of','in','on','for','to','and','or','with','as','at','by','from','is','are','was','were','be','been',
  'this','that','these','those','it','its','your','our','their','my','his','her',
])

/** Latin a-z + cyrillic а-я + digits, keep apostrophes inside words. */
const TOKEN_RE = /[a-zа-яёʻʼ\u2019\u02BB0-9]+/giu

export function tokenize(text: string | undefined): string[] {
  if (!text) return []
  const lower = text.toLowerCase()
  const m = lower.match(TOKEN_RE) || []
  return m
    .map((t) => t.replace(/^[ʻʼ\u2019\u02BB]+|[ʻʼ\u2019\u02BB]+$/g, ''))
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))
}

export function jaccard(aTokens: string[], bTokens: string[]): number {
  if (aTokens.length === 0 || bTokens.length === 0) return 0
  const a = new Set(aTokens)
  const b = new Set(bTokens)
  let inter = 0
  for (const t of a) if (b.has(t)) inter++
  const union = a.size + b.size - inter
  return union === 0 ? 0 : inter / union
}

export type CannibalCluster<T> = {
  members: Array<{ item: T; similarity: number }>
  topTokens: string[]
}

/**
 * Cheap O(n²) clustering — fine for ~150 stories.
 * Two items belong to the same cluster when their title-token Jaccard
 * similarity ≥ threshold. Members are connected components (transitive).
 */
export function clusterByTitle<T extends { title?: string; slug: string }>(
  items: T[],
  threshold = 0.45
): CannibalCluster<T>[] {
  const tokens = items.map((it) => tokenize(it.title))
  const parent: number[] = items.map((_, i) => i)
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }
  function union(a: number, b: number) {
    const ra = find(a), rb = find(b)
    if (ra !== rb) parent[ra] = rb
  }
  const edgeSim: Record<string, number> = {}
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const sim = jaccard(tokens[i], tokens[j])
      if (sim >= threshold) {
        union(i, j)
        edgeSim[`${i}:${j}`] = sim
        edgeSim[`${j}:${i}`] = sim
      }
    }
  }
  const groups: Record<number, number[]> = {}
  for (let i = 0; i < items.length; i++) {
    const r = find(i)
    groups[r] = groups[r] || []
    groups[r].push(i)
  }
  const clusters: CannibalCluster<T>[] = []
  for (const ids of Object.values(groups)) {
    if (ids.length < 2) continue
    const ref = ids[0]
    const members = ids.map((id) => ({
      item: items[id],
      similarity: id === ref ? 1 : edgeSim[`${ref}:${id}`] ?? 0,
    }))
    // top tokens by frequency
    const freq: Record<string, number> = {}
    for (const id of ids) for (const t of tokens[id]) freq[t] = (freq[t] || 0) + 1
    const topTokens = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([t]) => t)
    clusters.push({ members, topTokens })
  }
  // Largest first
  return clusters.sort((a, b) => b.members.length - a.members.length)
}

/**
 * For each money page, return supporting stories — stories whose title
 * tokens overlap ≥ threshold with the money page's H1/title.
 */
export function supportingStoriesFor<T extends { title?: string; slug: string; locale?: string }>(
  moneyTitle: string,
  locale: 'ru' | 'uz',
  stories: T[],
  threshold = 0.25
): Array<{ story: T; similarity: number }> {
  const target = tokenize(moneyTitle)
  if (target.length === 0) return []
  const matches: Array<{ story: T; similarity: number }> = []
  for (const s of stories) {
    if (s.locale && s.locale !== locale) continue
    const sim = jaccard(target, tokenize(s.title))
    if (sim >= threshold) matches.push({ story: s, similarity: sim })
  }
  return matches.sort((a, b) => b.similarity - a.similarity)
}
