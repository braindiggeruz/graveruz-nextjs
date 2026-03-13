import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { buildMetadata } from '@/lib/seo'
import SchemaOrg, { breadcrumbSchema, faqSchema } from '@/components/SchemaOrg'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'uz' }]
}

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
      description: 'Гарантии качества Graver.uz: точность гравировки до 0.1 мм, соблюдение сроков, замена брака, фотоотчёт каждого заказа. Работаем с B2B-клиентами в Ташкенте и по всему Узбекистану.',
    })
  }

  return buildMetadata({
    locale,
    path: 'guarantees',
    title: "Sifat kafolatlari — Graver.uz",
    description: "Graver.uz sifat kafolatlari: 0.1 mm aniqlikda o'ymakorlik, muddatlarga rioya, nuqsonlarni almashtirish, har bir buyurtmaning fotoaksi.",
  })
}

const guaranteesRu = [
  { title: 'Точность гравировки', desc: 'Воспроизводим ваш логотип с точностью до 0.1 мм. Перед тиражом согласовываем тестовый образец. Используем Fiber, CO2, MOPA и UV-лазеры для каждого типа материала.' },
  { title: 'Соблюдение сроков', desc: 'Выполняем заказы в оговорённые сроки. Типовые заказы — 1-3 рабочих дня. При задержке по нашей вине — скидка на следующий заказ.' },
  { title: 'Замена брака', desc: 'Если изделие не соответствует согласованному образцу — заменяем бесплатно. Контроль качества на каждом этапе производства.' },
  { title: 'Фотоотчёт каждого заказа', desc: 'Перед отправкой делаем фотографии готовой продукции и отправляем вам на согласование. Вы видите результат до получения.' },
  { title: 'Конфиденциальность', desc: 'Не передаём данные о ваших заказах, логотипах и корпоративных макетах третьим лицам. Подписываем NDA по запросу.' },
  { title: 'Поддержка после заказа', desc: 'Отвечаем на вопросы по заказу в течение 30 дней после получения. Помогаем с повторными заказами и дозаказами.' },
]

const guaranteesUz = [
  { title: "O'ymakorlik aniqligi", desc: "Logotipingizni 0.1 mm aniqlikda takrorlaymiz. Tirajdan oldin sinov namunasini kelishamiz. Har bir material turi uchun Fiber, CO2, MOPA va UV lazerlardan foydalanamiz." },
  { title: 'Muddatlarga rioya qilish', desc: "Buyurtmalarni kelishilgan muddatda bajaramiz. Oddiy buyurtmalar — 1-3 ish kuni. Bizning aybimiz bilan kechiksa — keyingi buyurtmaga chegirma." },
  { title: "Nuqsonlarni almashtirish", desc: "Buyum kelishilgan namunaga mos kelmasa — bepul almashtiramiz. Ishlab chiqarishning har bir bosqichida sifat nazorati." },
  { title: "Har bir buyurtmaning fotoaksi", desc: "Jo'natishdan oldin tayyor mahsulot suratlarini olamiz va sizga tasdiqlash uchun yuboramiz. Natijani olishdan oldin ko'rasiz." },
  { title: 'Maxfiylik', desc: "Buyurtmalaringiz, logotiplar va korporativ maketlar haqidagi ma'lumotlarni uchinchi shaxslarga bermayiz. So'rov bo'yicha NDA imzolaymiz." },
  { title: "Buyurtmadan keyin qo'llab-quvvatlash", desc: "Qabul qilgandan keyin 30 kun ichida buyurtma bo'yicha savollarga javob beramiz. Takroriy va qo'shimcha buyurtmalarda yordam beramiz." },
]

const processRu = [
  { step: '01', title: 'Заявка', desc: 'Вы описываете задачу: что нужно, тираж, сроки. Мы консультируем по материалам и технологиям.' },
  { step: '02', title: 'Макет', desc: 'Готовим цифровой макет с точными размерами. Вы утверждаете — только потом запускаем.' },
  { step: '03', title: 'Производство', desc: 'Гравируем на профессиональном оборудовании. Контроль качества каждого изделия.' },
  { step: '04', title: 'Фотоотчёт', desc: 'Фотографируем готовую продукцию и отправляем вам для финального согласования.' },
  { step: '05', title: 'Доставка', desc: 'Доставляем по Ташкенту бесплатно. По Узбекистану — через курьерские службы.' },
]

const processUz = [
  { step: '01', title: 'Ariza', desc: "Vazifani tasvirlaysiz: nima kerak, tiraj, muddatlar. Biz materiallar va texnologiyalar bo'yicha maslahat beramiz." },
  { step: '02', title: 'Maket', desc: "Aniq o'lchamlar bilan raqamli maket tayyorlaymiz. Siz tasdiqlaysiz — faqat shundan keyin boshlaymiz." },
  { step: '03', title: 'Ishlab chiqarish', desc: "Professional uskunalarda gravyura qilamiz. Har bir buyumning sifat nazorati." },
  { step: '04', title: 'Fotoaks', desc: "Tayyor mahsulotni suratga olamiz va yakuniy tasdiqlash uchun sizga yuboramiz." },
  { step: '05', title: 'Yetkazib berish', desc: "Toshkent bo'ylab bepul yetkazamiz. O'zbekiston bo'ylab — kuryer xizmatlari orqali." },
]

const faqItemsRu = [
  { q: 'Что делать, если гравировка не соответствует макету?', a: 'Мы бесплатно переделаем заказ. Перед тиражом всегда согласовываем тестовый образец, чтобы минимизировать такие ситуации.' },
  { q: 'Можно ли вернуть заказ?', a: 'Персонализированные изделия возврату не подлежат, но если качество не соответствует согласованному образцу — заменяем бесплатно.' },
  { q: 'Подписываете ли NDA?', a: 'Да, по запросу подписываем соглашение о неразглашении. Конфиденциальность ваших макетов и заказов — наш стандарт.' },
  { q: 'Как проверить качество до получения?', a: 'Мы отправляем фотоотчёт готовой продукции перед доставкой. При крупных тиражах — согласовываем тестовый образец.' },
]

const faqItemsUz = [
  { q: "Gravyura maketga mos kelmasa nima qilish kerak?", a: "Buyurtmani bepul qayta qilamiz. Tirajdan oldin har doim sinov namunasini kelishamiz, bunday holatlarni kamaytirish uchun." },
  { q: "Buyurtmani qaytarish mumkinmi?", a: "Shaxsiylashtirilgan buyumlar qaytarilmaydi, lekin sifat kelishilgan namunaga mos kelmasa — bepul almashtiramiz." },
  { q: "NDA imzolaysizmi?", a: "Ha, so'rov bo'yicha oshkor qilmaslik shartnomasi imzolaymiz. Maketlaringiz va buyurtmalaringiz maxfiyligi — bizning standartimiz." },
  { q: "Olishdan oldin sifatni qanday tekshirish mumkin?", a: "Yetkazishdan oldin tayyor mahsulotning fotoaksini yuboramiz. Katta tirajlarda — sinov namunasini kelishamiz." },
]

export default async function GuaranteesPage({ params }: PageProps) {
  const resolvedParams = await params
  if (!isValidLocale(resolvedParams.locale)) notFound()
  const locale = resolvedParams.locale as Locale
  const isRu = locale === 'ru'

  const breadcrumbs = [
    { name: 'Graver.uz', url: `https://graver-studio.uz/${locale}` },
    { name: isRu ? 'Гарантии' : 'Kafolatlar', url: `https://graver-studio.uz/${locale}/guarantees` },
  ]

  const guarantees = isRu ? guaranteesRu : guaranteesUz
  const process = isRu ? processRu : processUz
  const faqItems = isRu ? faqItemsRu : faqItemsUz

  return (
    <>
      <SchemaOrg schema={[breadcrumbSchema(breadcrumbs), faqSchema(faqItems)]} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li><Link href={`/${locale}`} className="hover:text-teal-500">Graver.uz</Link></li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-300">{isRu ? 'Гарантии' : 'Kafolatlar'}</li>
          </ol>
        </nav>

        <h1 className="text-4xl font-bold text-white mb-4">
          {isRu ? 'Гарантии качества' : 'Sifat kafolatlari'}
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          {isRu
            ? 'Мы гарантируем качество каждого изделия — от первого макета до доставки готовой продукции.'
            : "Har bir buyumning sifatini kafolatlaymiz — birinchi maketdan tayyor mahsulotni yetkazib berishgacha."}
        </p>

        {/* GUARANTEES GRID */}
        <div className="space-y-6 mb-16">
          {guarantees.map((item, i) => (
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

        {/* PROCESS SECTION */}
        <h2 className="text-3xl font-bold text-white mb-8">
          {isRu ? 'Как мы работаем' : 'Biz qanday ishlaymiz'}
        </h2>
        <div className="space-y-6 mb-16">
          {process.map((item, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-800 border border-teal-500/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-teal-500 font-bold text-lg">{item.step}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <h2 className="text-3xl font-bold text-white mb-8">
          {isRu ? 'Частые вопросы о гарантиях' : 'Kafolatlar haqida tez-tez beriladigan savollar'}
        </h2>
        <div className="space-y-4 mb-12">
          {faqItems.map((faq, i) => (
            <details key={i} className="group bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-teal-500/50 transition">
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between text-white font-semibold">
                <span>{faq.q}</span>
                <svg className="w-5 h-5 text-teal-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700">
          <p className="text-gray-300 mb-4">
            {isRu ? 'Остались вопросы? Напишите нам — ответим в течение 15 минут.' : "Savollaringiz bormi? Bizga yozing — 15 daqiqa ichida javob beramiz."}
          </p>
          <a
            href="https://t.me/GraverAdm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {isRu ? 'Написать в Telegram' : 'Telegramga yozish'}
          </a>
        </div>
      </div>
    </>
  )
}
