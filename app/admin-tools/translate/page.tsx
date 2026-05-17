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

      {/* ── Big "3 steps" block ────────────────────────────────── */}
      <section style={{ ...panel, marginTop: 18, background: '#0e1a3c', border: '1px solid #2a4480' }}>
        <h2 style={{ marginTop: 0 }}>Как создать UZ-перевод за 3 шага</h2>

        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 14 }}>
          <li style={stepBox}>
            <span style={stepNum}>1</span>
            <div>
              <strong>Открой Keystatic → SEO-инструменты → Переводы RU→UZ.</strong>
              <div style={{ marginTop: 6 }}>
                <a style={btnPrimary} href="/keystatic/collection/translationJobs" target="_blank">
                  ↗ Открыть Translation Jobs в Keystatic
                </a>
              </div>
            </div>
          </li>

          <li style={stepBox}>
            <span style={stepNum}>2</span>
            <div style={{ width: '100%' }}>
              <strong>Создай новую задачу и заполни:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <Copy label="sourceSlug" value="lazernaya-gravirovka-tashkent" />
                <Copy label="targetSlug" value="toshkentda-lazer-gravyura" />
                <Copy label="sourceLocale" value="ru" />
                <Copy label="targetLocale" value="uz (O‘zbek)" />
              </div>
              <p style={{ color: '#9aa8c4', fontSize: 13, marginTop: 8 }}>
                <code style={mono}>autoPublish</code> оставь <strong>выключенным</strong> — UZ-страница создаётся как Draft.
                <br />
                <code style={mono}>overwrite</code> оставь <strong>выключенным</strong> — Safe/skip существующую.
              </p>
            </div>
          </li>

          <li style={stepBox}>
            <span style={stepNum}>3</span>
            <div>
              <strong>Нажми Save, подожди 2–3 минуты, затем проверь Pages collection.</strong>
              <p style={{ color: '#9aa8c4', fontSize: 13, marginTop: 6 }}>
                GitHub Action подхватит задачу, Gemini переведёт страницу, новая запись появится в Keystatic → Страницы со статусом «Черновик».
              </p>
            </div>
          </li>
        </ol>

        <div style={warnBox}>
          ⚠ <strong>UZ-страница создаётся как Draft.</strong> После проверки её нужно опубликовать вручную (открой страницу → Статус: <em>Опубликовано</em> → Save).
        </div>
      </section>

      <section style={{ ...panel, marginTop: 20 }}>
        <h2 style={{ marginTop: 0 }}>Способ 2 — GitHub Actions (без Keystatic)</h2>
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
{`GEMINI_API_KEY=... npm run translate:page -- \\
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
const btnPrimary: React.CSSProperties = { display: 'inline-block', padding: '8px 14px', background: '#5eead4', color: '#0b1220', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }
const warnBox: React.CSSProperties = { background: '#3a1f10', border: '1px solid #ffb86b', color: '#ffd9a8', padding: '12px 14px', borderRadius: 8, fontSize: 14, marginTop: 16 }
const stepBox: React.CSSProperties = { display: 'flex', gap: 14, padding: 14, background: '#0b1220', border: '1px solid #1f2a44', borderRadius: 10 }
const stepNum: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: '#5eead4', color: '#0b1220', fontWeight: 800, flexShrink: 0 }

function Copy({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#0b1220', border: '1px solid #1f2a44', borderRadius: 8, padding: 10 }}>
      <div style={{ color: '#7a8aa8', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
        {label}
      </div>
      <code
        style={{
          display: 'block',
          color: '#5eead4',
          fontSize: 14,
          fontFamily: 'ui-monospace, monospace',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </code>
    </div>
  )
}
