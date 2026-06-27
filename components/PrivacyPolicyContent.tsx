import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface PrivacyPolicyContentProps {
  locale: Locale
}

const content = {
  ru: {
    h1: 'Политика конфиденциальности',
    updated: 'Дата последнего обновления: 27 июня 2026 г.',
    intro:
      'Настоящая Политика конфиденциальности описывает, как Graver Studio («мы», «наша студия») собирает, использует и защищает персональные данные посетителей сайта graver-studio.uz. Используя сайт и оставляя заявку, вы соглашаетесь с условиями данной Политики.',
    sections: [
      {
        h: '1. Кто мы',
        p: [
          'Graver Studio — студия лазерной гравировки и корпоративных подарков в Ташкенте, Узбекистан. Мы изготавливаем персонализированные подарки, наносим логотипы, имена и надписи на часы, ручки, зажигалки, ежедневники и другие изделия.',
          'Контакт по вопросам обработки данных: Telegram ',
        ],
      },
      {
        h: '2. Какие данные мы собираем',
        list: [
          'Имя и контактные данные (телефон, Telegram, e-mail), которые вы указываете при оформлении заявки.',
          'Содержание вашего обращения — описание заказа, макеты, пожелания по гравировке.',
          'Технические данные: IP-адрес, тип браузера и устройства, страницы сайта, которые вы просматривали (через файлы cookie и системы аналитики).',
        ],
      },
      {
        h: '3. Зачем мы используем данные',
        list: [
          'Чтобы связаться с вами, рассчитать стоимость и выполнить заказ.',
          'Чтобы отвечать на ваши вопросы и оказывать поддержку.',
          'Чтобы улучшать работу сайта и анализировать его посещаемость в обезличенном виде.',
          'Чтобы выполнять требования законодательства Республики Узбекистан.',
        ],
      },
      {
        h: '4. Файлы cookie и аналитика',
        p: [
          'Сайт использует файлы cookie и сервисы аналитики (Google Analytics, Meta Pixel) для сбора обезличенной статистики посещений. Эти данные не позволяют идентифицировать вас лично. Вы можете отключить cookie в настройках браузера — на основную работу сайта это не повлияет.',
        ],
      },
      {
        h: '5. Передача данных третьим лицам',
        p: [
          'Мы не продаём и не передаём ваши персональные данные третьим лицам в маркетинговых целях. Данные могут обрабатываться нашими техническими подрядчиками (хостинг, аналитика, мессенджеры) исключительно для обеспечения работы сервиса и в объёме, необходимом для оказания услуг.',
        ],
      },
      {
        h: '6. Хранение и защита',
        p: [
          'Мы храним персональные данные не дольше, чем это необходимо для целей обработки или установлено законом. Мы применяем разумные организационные и технические меры для защиты данных от несанкционированного доступа, изменения или уничтожения.',
        ],
      },
      {
        h: '7. Ваши права',
        list: [
          'Запросить информацию о том, какие ваши данные мы обрабатываем.',
          'Потребовать исправления или удаления ваших данных.',
          'Отозвать согласие на обработку данных, написав нам в Telegram.',
        ],
      },
      {
        h: '8. Изменения политики',
        p: [
          'Мы можем периодически обновлять данную Политику. Актуальная версия всегда размещена на этой странице с указанием даты последнего обновления.',
        ],
      },
      {
        h: '9. Контакты',
        p: [
          'По всем вопросам, связанным с обработкой персональных данных, пишите нам в Telegram: ',
        ],
      },
    ],
    backHome: 'На главную',
    tg: 'https://t.me/GraverAdm',
  },
  uz: {
    h1: 'Maxfiylik siyosati',
    updated: "Oxirgi yangilanish sanasi: 2026-yil 27-iyun",
    intro:
      "Ushbu Maxfiylik siyosati Graver Studio («biz», «studiyamiz») graver-studio.uz sayti tashrifchilarining shaxsiy ma'lumotlarini qanday yig'ishi, ishlatishi va himoya qilishini tavsiflaydi. Saytdan foydalanib va ariza qoldirib, siz ushbu Siyosat shartlariga rozilik bildirasiz.",
    sections: [
      {
        h: '1. Biz kimmiz',
        p: [
          "Graver Studio — Toshkent, O'zbekistondagi lazer o'ymakorlik va korporativ sovg'alar studiyasi. Biz shaxsiylashtirilgan sovg'alar tayyorlaymiz, soatlar, ruchkalar, zajigalkalar, kundaliklar va boshqa buyumlarga logotip, ism va yozuvlarni tushiramiz.",
          "Ma'lumotlarni qayta ishlash bo'yicha aloqa: Telegram ",
        ],
      },
      {
        h: "2. Qanday ma'lumotlarni yig'amiz",
        list: [
          "Ariza rasmiylashtirishda ko'rsatadigan ism va aloqa ma'lumotlari (telefon, Telegram, e-mail).",
          "Murojaatingiz mazmuni — buyurtma tavsifi, maketlar, o'ymakorlik bo'yicha istaklar.",
          "Texnik ma'lumotlar: IP-manzil, brauzer va qurilma turi, siz ko'rgan sayt sahifalari (cookie fayllari va analitika tizimlari orqali).",
        ],
      },
      {
        h: "3. Ma'lumotlarni nima uchun ishlatamiz",
        list: [
          "Siz bilan bog'lanish, narxni hisoblash va buyurtmani bajarish uchun.",
          "Savollaringizga javob berish va qo'llab-quvvatlash uchun.",
          "Sayt ishini yaxshilash va uning tashriflarini anonim shaklda tahlil qilish uchun.",
          "O'zbekiston Respublikasi qonunchiligi talablarini bajarish uchun.",
        ],
      },
      {
        h: '4. Cookie fayllari va analitika',
        p: [
          "Sayt anonim tashrif statistikasini yig'ish uchun cookie fayllari va analitika xizmatlaridan (Google Analytics, Meta Pixel) foydalanadi. Bu ma'lumotlar sizni shaxsan aniqlash imkonini bermaydi. Cookie fayllarini brauzer sozlamalarida o'chirib qo'yishingiz mumkin — bu saytning asosiy ishiga ta'sir qilmaydi.",
        ],
      },
      {
        h: "5. Ma'lumotlarni uchinchi shaxslarga berish",
        p: [
          "Biz sizning shaxsiy ma'lumotlaringizni marketing maqsadlarida uchinchi shaxslarga sotmaymiz va bermaymiz. Ma'lumotlar faqat xizmat ishlashini ta'minlash uchun va xizmat ko'rsatish uchun zarur hajmda texnik pudratchilarimiz (xosting, analitika, messenjerlar) tomonidan qayta ishlanishi mumkin.",
        ],
      },
      {
        h: '6. Saqlash va himoya',
        p: [
          "Biz shaxsiy ma'lumotlarni qayta ishlash maqsadlari uchun zarur bo'lgandan yoki qonunda belgilangandan uzoqroq saqlamaymiz. Ma'lumotlarni ruxsatsiz kirish, o'zgartirish yoki yo'q qilishdan himoya qilish uchun oqilona tashkiliy va texnik choralarni qo'llaymiz.",
        ],
      },
      {
        h: '7. Sizning huquqlaringiz',
        list: [
          "Qaysi ma'lumotlaringizni qayta ishlashimiz haqida ma'lumot so'rash.",
          "Ma'lumotlaringizni tuzatish yoki o'chirishni talab qilish.",
          "Telegram orqali bizga yozib, ma'lumotlarni qayta ishlashga rozilikni qaytarib olish.",
        ],
      },
      {
        h: "8. Siyosatdagi o'zgarishlar",
        p: [
          "Biz ushbu Siyosatni vaqti-vaqti bilan yangilashimiz mumkin. Eng so'nggi versiya har doim ushbu sahifada oxirgi yangilanish sanasi bilan joylashtiriladi.",
        ],
      },
      {
        h: '9. Aloqa',
        p: [
          "Shaxsiy ma'lumotlarni qayta ishlash bilan bog'liq barcha savollar bo'yicha bizga Telegram orqali yozing: ",
        ],
      },
    ],
    backHome: 'Bosh sahifaga',
    tg: 'https://t.me/GraverAdm',
  },
} as const

export default function PrivacyPolicyContent({ locale }: PrivacyPolicyContentProps) {
  const t = content[locale]

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <nav aria-label="breadcrumb" className="mb-8 text-sm text-gray-600">
          <Link href={`/${locale}/`} className="hover:text-teal-700 hover:underline">
            Graver.uz
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-800">{t.h1}</span>
        </nav>

        <h1 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">{t.h1}</h1>
        <p className="mb-8 text-sm text-gray-600">{t.updated}</p>

        <p className="mb-10 text-base leading-relaxed text-gray-800">{t.intro}</p>

        <div className="space-y-10">
          {t.sections.map((s, i) => (
            <section key={i}>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">{s.h}</h2>
              {'p' in s &&
                s.p?.map((para, j) => (
                  <p key={j} className="mb-3 text-base leading-relaxed text-gray-800">
                    {para}
                    {/* Append Telegram link to contact-style paragraphs ending with a space */}
                    {para.endsWith(' ') && (
                      <a
                        href={t.tg}
                        className="text-teal-700 underline hover:text-teal-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @GraverAdm
                      </a>
                    )}
                  </p>
                ))}
              {'list' in s && (
                <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-gray-800">
                  {s.list?.map((li, j) => (
                    <li key={j}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8">
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center font-medium text-teal-700 hover:text-teal-900 hover:underline"
          >
            ← {t.backHome}
          </Link>
        </div>
      </div>
    </main>
  )
}
