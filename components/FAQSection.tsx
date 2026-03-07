'use client'

interface FAQItem {
  q: string
  a: string
}

interface FAQSectionProps {
  locale: string
}

const faqItemsRu: FAQItem[] = [
  {
    q: 'Какой минимальный тираж для корпоративного заказа?',
    a: 'Минимального тиража нет. Делаем как 1 эксклюзивный подарок, так и серии на тысячи единиц. Цена за единицу снижается при объёмах от 50+ штук.',
  },
  {
    q: 'Можно ли сделать персонализацию для каждого сотрудника?',
    a: 'Да, делаем индивидуальную гравировку имени, должности, даты для каждого изделия в тираже. Пришлите список — подготовим макеты для согласования.',
  },
  {
    q: 'Работаете ли с юридическими лицами?',
    a: 'Да, работаем с юрлицами. Предоставляем все закрывающие документы, счета, акты. По согласованию возможна отсрочка платежа для постоянных клиентов.',
  },
  {
    q: 'Сколько времени занимает производство?',
    a: 'Типовые заказы — 1-3 дня после утверждения макета. Крупные тиражи и сложные проекты — обсуждаем индивидуально. Срочное производство — по запросу.',
  },
  {
    q: 'Что нужно от нас для начала работы?',
    a: 'Логотип в векторе (AI/SVG/PDF) или качественное фото. Описание: что наносим, на какие предметы, тираж, к какому сроку. Если нет готового макета — создадим сами.',
  },
  {
    q: 'На каких материалах делаете гравировку?',
    a: 'Металл (сталь, алюминий, латунь), анодированный алюминий, дерево, кожа, стекло, акрил, премиальные пластики. Fiber, CO2, MOPA и UV-технологии.',
  },
  {
    q: 'Можно ли увидеть результат до производства?',
    a: 'Обязательно. Это наш стандарт работы: вы получаете цифровой макет с точными размерами и размещением, утверждаете его, и только потом мы запускаем производство.',
  },
  {
    q: 'Предоставляете ли подарочную упаковку?',
    a: 'Да, предлагаем премиальную упаковку под ключ: коробки, пакеты, ленты, открытки — всё под ваш корпоративный стиль.',
  },
]

const faqItemsUz: FAQItem[] = [
  {
    q: 'Korporativ buyurtma uchun minimal tiraj qancha?',
    a: "Minimal tiraj yo'q. 1 ta eksklyuziv sovg'adan minglab donagacha tayyorlaymiz. 50+ donadan narx pasayadi.",
  },
  {
    q: 'Har bir xodim uchun personalizatsiya qilish mumkinmi?',
    a: "Ha, tirajdagi har bir mahsulot uchun individual ism, lavozim, sana gravyura qilamiz. Ro'yxat yuboring — tasdiqlash uchun maketlar tayyorlaymiz.",
  },
  {
    q: 'Yuridik shaxslar bilan ishlaysizmi?',
    a: "Ha, yuridik shaxslar bilan ishlaymiz. Barcha yopuvchi hujjatlar, hisob-fakturalar, dalolatnomalar taqdim etamiz. Doimiy mijozlar uchun to'lovni kechiktirish mumkin.",
  },
  {
    q: 'Ishlab chiqarish qancha vaqt oladi?',
    a: "Oddiy buyurtmalar — maketni tasdiqlagandan keyin 1-3 kun. Katta tirajlar va murakkab loyihalar — individual muhokama qilinadi. Shoshilinch ishlab chiqarish — so'rov bo'yicha.",
  },
  {
    q: 'Ishni boshlash uchun bizdan nima kerak?',
    a: "Vektor formatida logotip (AI/SVG/PDF) yoki sifatli foto. Tavsif: nima qo'yiladi, qaysi buyumlarga, tiraj, qachongacha. Tayyor maket bo'lmasa — o'zimiz yaratamiz.",
  },
  {
    q: 'Qaysi materiallarda gravyura qilasiz?',
    a: "Metall (po'lat, alyuminiy, latun), anodlangan alyuminiy, yog'och, charm, shisha, akril, premium plastmassalar. Fiber, CO2, MOPA va UV texnologiyalari.",
  },
  {
    q: "Ishlab chiqarishdan oldin natijani ko'rish mumkinmi?",
    a: "Albatta. Bu bizning standart ishimiz: aniq o'lchamlar va joylashuvga ega raqamli maket olasiz, uni tasdiqlaysiz, va faqat shundan keyin ishlab chiqarishni boshlaymiz.",
  },
  {
    q: "Sovg'a qadoqlash taqdim etasizmi?",
    a: "Ha, tayyor premium qadoqlash taklif qilamiz: qutichalar, paketlar, lentalar, ochiq xatlar — hammasi sizning korporativ uslubingizga mos.",
  },
]

export default function FAQSection({ locale }: FAQSectionProps) {
  const isRu = locale === 'ru'
  const items = isRu ? faqItemsRu : faqItemsUz

  return (
    <section id="faq" className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isRu ? 'Частые ' : 'Tez-tez '}
            <span className="text-teal-500">
              {isRu ? 'вопросы' : 'beriladigan savollar'}
            </span>
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((faq, index) => (
            <details
              key={index}
              className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-teal-500/50 transition"
            >
              <summary className="px-6 py-5 cursor-pointer list-none flex items-center justify-between text-white font-semibold text-lg">
                <span>{faq.q}</span>
                <svg
                  className="w-5 h-5 text-teal-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            {isRu ? 'Не нашли ответ на свой вопрос?' : 'Savolingizga javob topmadingizmi?'}
          </p>
          <a
            href="https://t.me/GraverAdm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-cyan-700 transition"
            data-track="tg"
            data-placement="faq"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {isRu ? 'Задать вопрос в Telegram' : 'Telegramda savol berish'}
          </a>
        </div>
      </div>
    </section>
  )
}
