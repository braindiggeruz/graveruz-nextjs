import { isAuthed, getServerToken } from '@/lib/admin-auth'
import { TokenForm } from '../_components/TokenForm'
import { getSnapshotPages } from '@/lib/seo-snapshot'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function TranslateAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  if (!getServerToken()) {
    return (
      <div style={panel}>
        ADMIN_TOOLS_TOKEN не настроен. См. <a href="/admin-tools/" style={link}>/admin-tools/</a>.
      </div>
    )
  }
  if (!(await isAuthed(sp.token))) return <TokenForm />

  const pages = getSnapshotPages()
  const ruPages = pages.filter((p) => (p.locale || 'ru') === 'ru')
  const uzSlugs = new Set(pages.filter((p) => p.locale === 'uz').map((p) => p.slug))

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Translate RU → UZ</h1>
      <p style={{ color: '#9aa8c4' }}>
        Создание UZ-версии страницы из RU. Все варианты ниже безопасны — RU-страница НЕ перезаписывается.
      </p>

      <section style={{ ...panel, marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Способ 1 — через Keystatic (рекомендуется)</h2>
        <ol style={{ lineHeight: 1.9, color: '#cbd5ea' }}>
          <li>
            Открой Keystatic → <strong>SEO-инструменты → Переводы (RU → UZ)</strong> →{' '}
            <em>Create entry</em>.
          </li>
          <li>
            Введи <code style={mono}>ID задачи</code> (любой уникальный, например{' '}
            <code style={mono}>lazernaya-gravirovka-2026-03-15</code>).
          </li>
          <li>
            Заполни <code style={mono}>Slug исходной страницы (RU)</code> — точный slug RU-страницы.
          </li>
          <li>
            Оставь статус <code style={mono}>Новая (поставить в очередь)</code>.
          </li>
          <li>Нажми Save — Keystatic закоммитит job в GitHub.</li>
          <li>
            GitHub Action <code style={mono}>Translate Pages</code> подхватит job (1-3 минуты),
            переведёт через Gemini, закоммитит UZ-страницу как <strong>Draft</strong>.
          </li>
          <li>
            После Cloudflare deploy (1-3 мин) UZ-страница появится в Keystatic → <strong>Страницы</strong> — открой и проверь.
          </li>
          <li>
            Если всё OK, поменяй статус с <em>Черновик</em> на <em>Опубликовано</em> и сохрани.
          </li>
        </ol>
      </section>

      <section style={{ ...panel, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Способ 2 — GitHub Actions (manual dispatch)</h2>
        <p style={{ color: '#9aa8c4', fontSize: 14 }}>
          Открой:{' '}
          <a
            style={link}
            href="https://github.com/braindiggeruz/graveruz-nextjs/actions/workflows/translate.yml"
            target="_blank"
          >
            GitHub Actions → Translate Pages
          </a>{' '}
          → <em>Run workflow</em> → введи source slug. Результат — коммит с UZ-страницей.
        </p>
      </section>

      <section style={{ ...panel, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Способ 3 — локальный CLI (для разработчика)</h2>
        <pre style={pre}>
{`# Установи зависимости (один раз)
npm install

# Запусти перевод с локальным GEMINI_API_KEY
GEMINI_API_KEY=... npm run translate:page -- \\
  --source=lazernaya-gravirovka-tashkent \\
  --link-source

# Dry run (без записи файлов)
GEMINI_API_KEY=... npm run translate:page -- \\
  --source=lazernaya-gravirovka-tashkent --dry-run`}
        </pre>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2>Какие RU-страницы можно переводить</h2>
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>RU slug</th>
                <th style={th}>Status</th>
                <th style={th}>H1</th>
                <th style={th}>UZ пара</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ruPages.map((p) => {
                const uzSlug = p.alternateSlug?.uz
                const uzExists = uzSlug && uzSlugs.has(uzSlug)
                return (
                  <tr key={p.slug}>
                    <td style={td}>
                      <code style={mono}>{p.slug}</code>
                    </td>
                    <td style={td}>
                      <span style={{ color: p.status === 'published' ? '#5eead4' : '#ffe066' }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={td}>{p.h1 || '—'}</td>
                    <td style={td}>
                      {uzExists ? (
                        <span style={{ color: '#5eead4' }}>✓ {uzSlug}</span>
                      ) : uzSlug ? (
                        <span style={{ color: '#ffb86b' }}>прописан, но нет файла</span>
                      ) : (
                        <span style={{ color: '#9aa8c4' }}>—</span>
                      )}
                    </td>
                    <td style={td}>
                      {!uzExists && (
                        <a
                          style={link}
                          href="/keystatic/collection/translationJobs/new"
                          target="_blank"
                        >
                          Create job →
                        </a>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={{ ...panel, marginTop: 24 }}>
        <h2 style={{ marginTop: 0 }}>Что переводится</h2>
        <ul style={{ color: '#cbd5ea', lineHeight: 1.8 }}>
          <li>H1, intro</li>
          <li>SEO title, meta description</li>
          <li>Все блоки: hero, features, image+text, FAQ, CTA, richText</li>
          <li>Все вопросы и ответы FAQ</li>
        </ul>
        <h3 style={{ marginTop: 18 }}>Что НЕ переводится</h3>
        <ul style={{ color: '#cbd5ea', lineHeight: 1.8 }}>
          <li>URLs (ctaHref, buttonHref) — но <code>/ru/</code> в markdown-ссылках автоматически меняется на <code>/uz/</code></li>
          <li>Image paths (картинки копируются, пути обновляются)</li>
          <li>Slugs, locale, status, noindex, icon — структурные поля</li>
          <li>
            Brand names: <code>Graver Studio</code>, <code>Graver.uz</code>, <code>graver-studio.uz</code>
          </li>
        </ul>
      </section>
    </div>
  )
}

const panel: React.CSSProperties = { background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12, padding: 20 }
const tableWrap: React.CSSProperties = { overflowX: 'auto', background: '#0d1830', border: '1px solid #1f2a44', borderRadius: 12 }
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #1f2a44', color: '#9aa8c4', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }
const td: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #11192b', color: '#e6edf3' }
const link: React.CSSProperties = { color: '#9ec1ff', textDecoration: 'none' }
const mono: React.CSSProperties = { background: '#1f2a44', padding: '1px 6px', borderRadius: 4, fontSize: 12 }
const pre: React.CSSProperties = { background: '#0b1220', padding: 14, borderRadius: 8, overflowX: 'auto', fontSize: 13, color: '#cbd5ea', border: '1px solid #1f2a44' }
