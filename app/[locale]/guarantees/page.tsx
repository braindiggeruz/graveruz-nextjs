import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { breadcrumbSchema } from '@/components/SchemaOrg'
export const runtime = 'edge'


interface PageProps {
  params: Promise<{ locale: string }>
}


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) return {}
  const locale = resolvedParams.locale as Locale

  if (locale === 'ru') {
    return buildMetadata({
      locale,
      path: 'guarantees',
      title: 'Гарантии качества — Graver.uz',
      description: 'Гарантии качества Graver.uz: точность гравировки, соблюдение сроков, замена брака. Работаем с B2B-клиентами в Ташкенте и по всему Узбекистану.',
    })
  }

  return buildMetadata({
    locale,
    path: 'guarantees',
    title: "Sifat kafolatlari — Graver.uz",
    description: "Graver.uz sifat kafolatlari: o'ymakorlik aniqligi, muddatlarga rioya qilish, nuqsonlarni almashtirish.",
  })
}

export const revalidate = 3600 // ISR: revalidate every 1 hour

export default async function GuaranteesPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: isRu ? 'Гарантии' : 'Kafolatlar', url: `https://graver-studio.uz/${locale}/guarantees` },
  ]

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema(breadcrumbs)} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{isRu ? 'Гарантии' : 'Kafolatlar'}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-8">
          {isRu ? 'Гарантии качества' : 'Sifat kafolatlari'}
        </h1>

        <div className="space-y-6">
          {(isRu ? [
            { title: 'Точность гравировки', desc: 'Воспроизводим ваш логотип с точностью до 0.1 мм. Перед тиражом согласовываем тестовый образец.' },
            { title: 'Соблюдение сроков', desc: 'Выполняем заказы в оговорённые сроки. При задержке по нашей вине — скидка на следующий заказ.' },
            { title: 'Замена брака', desc: 'Если изделие не соответствует согласованному образцу — заменяем бесплатно.' },
            { title: 'Конфиденциальность', desc: 'Не передаём данные о ваших заказах и логотипах третьим лицам.' },
            { title: 'Поддержка после заказа', desc: 'Отвечаем на вопросы по заказу в течение 30 дней после получения.' },
          ] : [
            { title: "O'ymakorlik aniqligi", desc: "Logotipingizni 0.1 mm aniqlikda takrorlaymiz. Tirajdan oldin sinov namunasini kelishamiz." },
            { title: 'Muddatlarga rioya qilish', desc: "Buyurtmalarni kelishilgan muddatda bajaramiz. Bizning aybimiz bilan kechiksa — keyingi buyurtmaga chegirma." },
            { title: "Nuqsonlarni almashtirish", desc: "Buyum kelishilgan namunaga mos kelmasa — bepul almashtiramiz." },
            { title: 'Maxfiylik', desc: "Buyurtmalaringiz va logotiplar haqidagi ma'lumotlarni uchinchi shaxslarga bermayiz." },
            { title: "Buyurtmadan keyin qo'llab-quvvatlash", desc: "Qabul qilgandan keyin 30 kun ichida buyurtma bo'yicha savollarga javob beramiz." },
          ]).map((item, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">{item.title}</h2>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
