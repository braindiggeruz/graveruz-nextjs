import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import {
  Check,
  Grid as GridIcon,
  Clock,
  Zap,
  Sparkles,
  Users,
  Gift,
  Package,
  Briefcase,
  Star,
  Trophy,
  Rocket,
} from 'lucide-react'

const ICONS = {
  check: Check,
  grid: GridIcon,
  clock: Clock,
  zap: Zap,
  sparkles: Sparkles,
  users: Users,
  gift: Gift,
  package: Package,
  briefcase: Briefcase,
  star: Star,
  trophy: Trophy,
  laser: Rocket,
} as const

type IconKey = keyof typeof ICONS

// Keystatic conditional block — discriminated by `discriminant`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = any

interface Props {
  blocks: Block[] | null | undefined
}

/**
 * Renders the 6 Keystatic block types defined in keystatic.config.ts → pages.blocks.
 * Pure server component — no client state, all SSG.
 */
export default function PageBlocks({ blocks }: Props) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const k = block.discriminant as
          | 'hero'
          | 'richText'
          | 'features'
          | 'imageText'
          | 'cta'
          | 'faq'
        const v = block.value

        if (k === 'hero') {
          return (
            <section
              key={i}
              data-testid="page-block-hero"
              className="relative overflow-hidden border-b border-gray-800 bg-gradient-to-b from-gray-950 to-black py-20 px-4"
            >
              <div className="max-w-5xl mx-auto">
                {v.badge && (
                  <span className="inline-block rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1 text-xs font-medium tracking-widest text-teal-400 uppercase">
                    {v.badge}
                  </span>
                )}
                {v.title && (
                  <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {v.title}
                  </h1>
                )}
                {v.subtitle && (
                  <p className="mt-6 max-w-2xl text-lg text-gray-300 leading-relaxed">
                    {v.subtitle}
                  </p>
                )}
                {v.ctaLabel && v.ctaHref && (
                  <Link
                    href={v.ctaHref}
                    data-testid="page-block-hero-cta"
                    className="mt-8 inline-block rounded-md bg-teal-500 px-6 py-3 font-semibold text-black transition hover:bg-teal-400"
                  >
                    {v.ctaLabel}
                  </Link>
                )}
                {v.image && (
                  <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800">
                    <Image
                      src={v.image}
                      alt={v.title || ''}
                      width={1600}
                      height={900}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </section>
          )
        }

        if (k === 'richText') {
          return (
            <section
              key={i}
              data-testid="page-block-rich-text"
              className="px-4 py-16"
            >
              <article className="prose prose-invert mx-auto max-w-3xl">
                {v.body && <MDXRemote source={v.body} />}
              </article>
            </section>
          )
        }

        if (k === 'features') {
          const items: Array<{ icon: IconKey; title: string; description: string }> =
            v.items || []
          return (
            <section
              key={i}
              data-testid="page-block-features"
              className="border-t border-gray-900 px-4 py-20"
            >
              <div className="max-w-6xl mx-auto">
                {v.title && (
                  <h2 className="mb-12 text-3xl sm:text-4xl font-bold text-white">
                    {v.title}
                  </h2>
                )}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((it, idx) => {
                    const Icon = ICONS[it.icon] || Check
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 transition hover:border-teal-500/50"
                      >
                        <Icon className="h-8 w-8 text-teal-400" aria-hidden />
                        <h3 className="mt-4 text-lg font-semibold text-white">
                          {it.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                          {it.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        }

        if (k === 'imageText') {
          const isRight = v.imageSide === 'right'
          return (
            <section
              key={i}
              data-testid="page-block-image-text"
              className="border-t border-gray-900 px-4 py-20"
            >
              <div
                className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${
                  isRight ? 'md:[&>*:first-child]:order-1 md:[&>*:last-child]:order-2' : ''
                }`}
              >
                {v.image && (
                  <div className="overflow-hidden rounded-2xl border border-gray-800">
                    <Image
                      src={v.image}
                      alt={v.title || ''}
                      width={900}
                      height={700}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
                <div>
                  {v.title && (
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">
                      {v.title}
                    </h2>
                  )}
                  {v.body && (
                    <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-gray-300">
                      {v.body}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )
        }

        if (k === 'cta') {
          return (
            <section
              key={i}
              data-testid="page-block-cta"
              className="border-t border-gray-900 px-4 py-20"
            >
              <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 p-10">
                {v.title && (
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    {v.title}
                  </h2>
                )}
                {v.subtitle && (
                  <p className="max-w-2xl text-base text-gray-300">{v.subtitle}</p>
                )}
                {v.buttonLabel && v.buttonHref && (
                  <Link
                    href={v.buttonHref}
                    data-testid="page-block-cta-button"
                    className="rounded-md bg-teal-500 px-6 py-3 font-semibold text-black transition hover:bg-teal-400"
                  >
                    {v.buttonLabel}
                  </Link>
                )}
              </div>
            </section>
          )
        }

        if (k === 'faq') {
          const items: Array<{ q: string; a: string }> = v.items || []
          return (
            <section
              key={i}
              data-testid="page-block-faq"
              className="border-t border-gray-900 px-4 py-20"
            >
              <div className="mx-auto max-w-3xl">
                {v.title && (
                  <h2 className="mb-10 text-3xl sm:text-4xl font-bold text-white">
                    {v.title}
                  </h2>
                )}
                <div className="space-y-3">
                  {items.map((it, idx) => (
                    <details
                      key={idx}
                      className="rounded-xl border border-gray-800 bg-gray-900/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-4 font-medium text-white transition hover:text-teal-400">
                        {it.q}
                        <span className="ml-4 text-teal-500">+</span>
                      </summary>
                      <div className="px-6 pb-5 text-sm leading-relaxed text-gray-400">
                        {it.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        return null
      })}
    </>
  )
}
