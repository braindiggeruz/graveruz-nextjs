/**
 * Cannibalization Radar — finds blog stories competing for the same
 * Google query, recommends an action per cluster.
 *
 * Algorithm:
 *   1. Tokenize titles (RU + UZ-Latin, drop stopwords).
 *   2. Pair-wise Jaccard similarity, threshold = 0.45.
 *   3. Connected components → "cluster".
 *   4. Suggest canonical (the article with most words + newest date).
 *   5. NEVER auto-delete or auto-301. Operator decides in Keystatic.
 *
 * Same-locale only — RU vs UZ never cannibalize (different SERP).
 */
import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import { getSnapshotStories, getSnapshotMeta } from '@/lib/seo-snapshot'
import { clusterByTitle } from '@/lib/seo-cluster'
import type { CMSStory } from '@/lib/seo-types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BASE = 'https://graver-studio.uz'

function keystaticUrl(file?: string) {
  if (!file) return '/keystatic/'
  const m = file.match(/content\/blog\/(ru|uz)\/(.+?)\.mdx$/)
  if (!m) return '/keystatic/'
  return `/keystatic/branch/main/collection/stories/item/${encodeURIComponent(`${m[1]}/${m[2]}`)}`
}

function pickCanonical(members: CMSStory[]): CMSStory {
  // Prefer non-noindex, highest word count, then newest date, then alphabetic.
  return [...members]
    .sort((a, b) => {
      if (!!a.noindex !== !!b.noindex) return a.noindex ? 1 : -1
      const wa = a.wordCount || 0
      const wb = b.wordCount || 0
      if (wa !== wb) return wb - wa
      return (b.date || '').localeCompare(a.date || '')
    })[0]
}

function suggestAction(member: CMSStory, canonical: CMSStory): { action: string; color: string; why: string } {
  if (member.slug === canonical.slug) {
    return { action: 'KEEP', color: '#5eead4', why: 'Самая сильная статья — оставляем как canonical.' }
  }
  if ((member.wordCount || 0) < 200) {
    return {
      action: 'MERGE → ' + canonical.slug,
      color: '#ffb86b',
      why: 'Тонкая статья. Лучшие куски → в canonical, эту в Keystatic поставь noindex или впиши canonicalOverride.',
    }
  }
  if ((member.wordCount || 0) >= 400) {
    return {
      action: 'UPDATE',
      color: '#a8d8ff',
      why: 'Контент весомый. Перепиши угол под уникальный intent (например, "для банков" vs canonical "для IT").',
    }
  }
  return {
    action: 'NOINDEX or canonical→' + canonical.slug,
    color: '#ffe066',
    why: 'Средний объём. Самое безопасное — canonicalOverride на canonical, либо noindex.',
  }
}

export default async function CannibalizationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; loc?: string; threshold?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) return <div style={panel}>ADMIN_TOOLS_TOKEN не настроен.</div>
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const stories = getSnapshotStories()
  const meta = getSnapshotMeta()
  const loc = (sp.loc as 'ru' | 'uz') || 'ru'
  const threshold = Math.max(0.3, Math.min(0.85, parseFloat(sp.threshold || '0.45') || 0.45))

  const scope = stories.filter((s) => s.locale === loc && !s.canonicalOverride)
  const clusters = clusterByTitle(scope, threshold)

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Cannibalization Radar</h1>
      <p style={{ color: '#9aa8c4' }}>
        Группировка статей, которые конкурируют за одни и те же запросы Google. Решение всегда за тобой —
        здесь только рекомендации.
        <br />
        <small style={{ color: '#5a6a87' }}>Snapshot: {meta.generatedAt}</small>
      </p>

      <form style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', margin: '16px 0' }}>
        <input type="hidden" name="token" defaultValue={sp.token || ''} />
        <label style={{ color: '#9aa8c4', fontSize: 13 }}>
          Язык:{' '}
          <select name="loc" defaultValue={loc} style={input}>
            <option value="ru">RU ({stories.filter((s) => s.locale === 'ru').length})</option>
            <option value="uz">UZ ({stories.filter((s) => s.locale === 'uz').length})</option>
          </select>
        </label>
        <label style={{ color: '#9aa8c4', fontSize: 13 }}>
          Порог сходства:{' '}
          <input name="threshold" type="number" min="0.3" max="0.85" step="0.05" defaultValue={threshold} style={{ ...input, width: 80 }} />
        </label>
        <button type="submit" style={btnPrimary}>Пересчитать</button>
        <span style={{ color: '#7a8aa8', fontSize: 12 }}>
          0.35 = мягко (много групп) · 0.45 = баланс · 0.60 = строго (только явные дубли)
        </span>
      </form>

      <p style={{ color: '#9aa8c4', fontSize: 14 }}>
        Найдено <strong style={{ color: '#ffb86b' }}>{clusters.length}</strong> кластер
        {clusters.length === 1 ? '' : clusters.length < 5 ? 'а' : 'ов'} (≥2 статьи на одну тему).
        В <strong>{loc.toUpperCase()}</strong>.
      </p>

      <section style={{ display: 'grid', gap: 16 }}>
        {clusters.length === 0 && (
          <div style={{ ...panel, color: '#5eead4' }}>
            ✓ Нет видимых дублей при пороге {threshold}. Опусти порог если хочешь увидеть слабые пересечения.
          </div>
        )}
        {clusters.map((cluster, idx) => {
          const members = cluster.members.map((m) => m.item as CMSStory)
          const canonical = pickCanonical(members)
          return (
            <div key={idx} style={panel}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>Кластер #{idx + 1} · {members.length} статьи</h3>
                  <p style={{ margin: '6px 0 0', color: '#9aa8c4', fontSize: 13 }}>
                    Общие слова:{' '}
                    {cluster.topTokens.map((t) => (
                      <code key={t} style={{ ...mono, marginRight: 6 }}>{t}</code>
                    ))}
                  </p>
                </div>
                <div style={{ color: '#5eead4', fontSize: 13 }}>
                  Canonical: <code style={mono}>{canonical.slug}</code>
                </div>
              </div>

              <div style={{ ...tableWrap, marginTop: 12 }}>
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={th}>Slug</th>
                      <th style={th}>Заголовок</th>
                      <th style={th}>Words</th>
                      <th style={th}>Дата</th>
                      <th style={th}>Sim</th>
                      <th style={th}>Рекомендация</th>
                      <th style={th}>Open</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cluster.members.map(({ item, similarity }) => {
                      const s = item as CMSStory
                      const rec = suggestAction(s, canonical)
                      return (
                        <tr key={s.slug}>
                          <td style={{ ...td, color: '#9ec1ff', fontFamily: 'monospace', fontSize: 12 }}>{s.slug}</td>
                          <td style={{ ...td, maxWidth: 380 }}>{s.title}</td>
                          <td style={td}>{s.wordCount || 0}</td>
                          <td style={{ ...td, color: '#9aa8c4' }}>{s.date || '—'}</td>
                          <td style={{ ...td, color: '#9aa8c4' }}>{Math.round(similarity * 100)}%</td>
                          <td style={td}>
                            <span title={rec.why} style={{ color: rec.color, fontWeight: 700, fontSize: 12 }}>
                              {rec.action}
                            </span>
                            <div style={{ color: '#7a8aa8', fontSize: 11, marginTop: 2 }}>{rec.why}</div>
                          </td>
                          <td style={td}>
                            <a style={link} href={keystaticUrl(s.file)} target="_blank" rel="noopener">✎</a>{' '}
                            <a style={link} href={`${BASE}/${s.locale}/blog/${s.slug}/`} target="_blank" rel="noopener">↗</a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </section>

      <section style={{ ...panel, marginTop: 32 }}>
        <h3 style={{ marginTop: 0 }}>Как действовать (правила оператора)</h3>
        <ul style={{ color: '#9aa8c4', lineHeight: 1.8, paddingLeft: 18, fontSize: 14 }}>
          <li><strong style={{ color: '#5eead4' }}>KEEP</strong> — Canonical статью оставляем. Дополняем её лучшими кусками из остальных.</li>
          <li><strong style={{ color: '#ffb86b' }}>MERGE</strong> — В Keystatic у тонкой статьи: поставить <code style={mono}>noindex=true</code> ИЛИ
            <code style={mono}>canonicalOverride: https://graver-studio.uz/{'{locale}'}/blog/{'{canonical-slug}'}/</code>.
            Контент перенести в canonical.</li>
          <li><strong style={{ color: '#a8d8ff' }}>UPDATE</strong> — Большая статья — перепиши угол так, чтобы intent не совпадал
            (например, "для IT-компаний" vs "для банков" vs "к 8 марта").</li>
          <li><strong style={{ color: '#ffe066' }}>NOINDEX</strong> — Скрываем от Google, но контент остаётся для прямых ссылок.
            Безопаснее чем 301-редирект — никого не теряем.</li>
          <li><strong style={{ color: '#ff6b6b' }}>НИКОГДА</strong> — не удаляй статьи и не ставь 301 без явного решения. Это безвозвратные SEO-действия.</li>
        </ul>
      </section>
    </div>
  )
}

const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 20 }
const tableWrap: React.CSSProperties = { overflowX: 'auto', background: '#0a132a', border: '1px solid #1f2a44', borderRadius: 8 }
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th: React.CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #1f2a44', color: '#9aa8c4', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }
const td: React.CSSProperties = { padding: '8px 10px', borderBottom: '1px solid #11192b', color: '#e6edf3', verticalAlign: 'top' }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }
const input: React.CSSProperties = { padding: '6px 10px', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 6, color: '#e6edf3', fontSize: 13 }
const btnPrimary: React.CSSProperties = { padding: '8px 16px', background: '#5eead4', color: '#0b1220', border: 0, borderRadius: 8, fontWeight: 700, cursor: 'pointer' }
