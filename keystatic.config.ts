import { config, fields, collection, singleton } from '@keystatic/core'
import { GraverMark } from './keystatic.ui'

/**
 * Graver Studio CMS — Keystatic config (Marketer Edition)
 *
 * Все labels на русском (редактор-маркетолог из Ташкента).
 * Descriptions — короткие, бизнес-понятные, не developer-jargon.
 * Поля сгруппированы для спокойного восприятия (без ломки YAML).
 *
 * 5 модулей:
 *   1. Главная       — singleton (hero + блоки)
 *   2. Страницы      — collection (page builder из 6 блоков)
 *   3. Истории       — collection (блог, читает существующие MDX)
 *   4. Продукты      — collection (auto-schema)
 *   5. Настройки     — singleton (бренд, контакты, аналитика)
 */

// ─── Reusable atoms ─────────────────────────────────────────────────

const LOCALES = [
  { label: 'Русский', value: 'ru' },
  { label: "O'zbek", value: 'uz' },
] as const

const STATUS_OPTIONS = [
  { label: 'Черновик', value: 'draft' },
  { label: 'Опубликовано', value: 'published' },
] as const

/** SEO-блок — одинаковый для всех типов контента */
const seoFields = fields.object(
  {
    title: fields.text({
      label: 'SEO Title',
      description:
        'Этот заголовок видит пользователь в Google. Цель: 50–60 символов. До 60 — идеально, 60–70 — допустимо, дальше Google обрежет.',
      validation: { length: { min: 1, max: 120 } },
    }),
    description: fields.text({
      label: 'Meta Description',
      description:
        'Краткая «продающая» строка под заголовком в Google. Цель: 140–160 символов. Должна содержать ключевое преимущество и CTA.',
      multiline: true,
      validation: { length: { min: 1, max: 320 } },
    }),
    ogImage: fields.image({
      label: 'Картинка для соцсетей (1200×630)',
      description:
        'Превью при шеринге в Telegram, Facebook, LinkedIn. Если пусто — используется дефолтная картинка из Настроек.',
      directory: 'public/images/og',
      publicPath: '/images/og/',
    }),
    noindex: fields.checkbox({
      label: 'Скрыть от Google (noindex)',
      description:
        'Только для технических страниц (спасибо, дубль, тест). Никогда не включай для коммерческих и блоговых страниц.',
      defaultValue: false,
    }),
  },
  {
    label: 'SEO',
    description:
      'Как страница выглядит в Google и соцсетях. Заполни — иначе Google возьмёт обрывок текста наугад.',
  }
)

/** История слагов — авто-301 при смене URL */
const previousSlugsField = fields.array(
  fields.text({
    label: 'Старый URL',
    description: 'Например: korporativnyje-podarki-tashkent',
  }),
  {
    label: 'История URL (авто-301)',
    description:
      'ВАЖНО для SEO: если ты меняешь slug опубликованной страницы — добавь сюда старый. Сайт сам поставит постоянный 301-редирект, чтобы не потерять трафик и обратные ссылки.',
    itemLabel: (p) => p.value || '— пустой —',
  }
)

/** Иконки — куратиная подборка из lucide-react */
const iconPicker = fields.select({
  label: 'Иконка',
  options: [
    { label: '✓  Галочка', value: 'check' },
    { label: '▦  Сетка', value: 'grid' },
    { label: '⏱  Часы', value: 'clock' },
    { label: '⚡  Молния', value: 'zap' },
    { label: '✨  Искры', value: 'sparkles' },
    { label: '👥  Люди', value: 'users' },
    { label: '🎁  Подарок', value: 'gift' },
    { label: '📦  Коробка', value: 'package' },
    { label: '💼  Кейс', value: 'briefcase' },
    { label: '⭐  Звезда', value: 'star' },
    { label: '🏆  Кубок', value: 'trophy' },
    { label: '✦  Лазер', value: 'laser' },
  ],
  defaultValue: 'check',
})

/** Билингвальный объект: { ru, uz } */
const bilingualText = (label: string, multiline = false) =>
  fields.object({
    ru: fields.text({ label: `${label} (RU) — обязательно`, multiline }),
    uz: fields.text({ label: `${label} (UZ) — желательно`, multiline }),
  })

// ─── 1. SETTINGS ────────────────────────────────────────────────────
const settings = singleton({
  label: 'Настройки сайта',
  path: 'content/settings/',
  format: { data: 'yaml' },
  previewUrl: 'https://graver-studio.uz/ru/',
  schema: {
    // ─ Бренд ─
    brandName: fields.text({
      label: 'Название бренда',
      description: 'Появляется в шапке, schema.org Organization, og:site_name.',
      defaultValue: 'Graver.uz',
    }),
    brandAlternateName: fields.text({
      label: 'Альтернативное название',
      description: 'Дополнительное имя бренда (например, юридическое).',
      defaultValue: 'Graver Studio',
    }),
    tagline: bilingualText('Слоган'),

    // ─ Контакты ─
    phone1: fields.text({
      label: 'Основной телефон',
      description: 'Без пробелов и скобок (для tel: ссылок). Например: +998770802288',
      defaultValue: '+998770802288',
    }),
    phone1Display: fields.text({
      label: 'Основной телефон (для показа)',
      description: 'Как пользователь видит номер на сайте.',
      defaultValue: '+998 77 080 22 88',
    }),
    phone2: fields.text({
      label: 'Дополнительный телефон',
      defaultValue: '+998974802288',
    }),
    phone2Display: fields.text({
      label: 'Дополнительный телефон (для показа)',
      defaultValue: '+998 97 480 22 88',
    }),
    telegram: fields.text({ label: 'Telegram (хендл)', defaultValue: '@GraverAdm' }),
    telegramUrl: fields.url({
      label: 'Telegram (ссылка)',
      defaultValue: 'https://t.me/GraverAdm',
    }),
    whatsapp: fields.url({
      label: 'WhatsApp (ссылка)',
      description: 'Формат: https://wa.me/998770802288',
      defaultValue: 'https://wa.me/998770802288',
    }),
    email: fields.text({ label: 'Email' }),

    // ─ Адрес ─
    addressStreet: fields.text({ label: 'Улица, дом', defaultValue: 'ул. Мукими, 59' }),
    addressCity: fields.text({ label: 'Город', defaultValue: 'Ташкент' }),
    addressCountry: fields.text({
      label: 'Код страны (ISO)',
      description: 'UZ для Узбекистана. Двухбуквенный код по ISO 3166-1.',
      defaultValue: 'UZ',
    }),
    geoLat: fields.number({
      label: 'Широта',
      description: 'Координаты для Google Maps / schema.org. Текущие — Мукими, 59.',
      defaultValue: 41.2995,
    }),
    geoLng: fields.number({ label: 'Долгота', defaultValue: 69.2401 }),

    // ─ Часы работы ─
    openingHoursLabel: bilingualText('Часы работы (надпись)'),
    requests247Label: bilingualText('Подпись «Заявки 24/7»'),

    // ─ Соцсети и трекинг ─
    defaultOgImage: fields.image({
      label: 'Дефолтная картинка для соцсетей',
      description:
        'Используется на страницах, где не задана своя OG-картинка. Размер: 1200×630.',
      directory: 'public/images/og',
      publicPath: '/images/og/',
    }),
    ga4Id: fields.text({
      label: 'Google Analytics 4 ID',
      description: 'Формат: G-XXXXXXXXXX',
      defaultValue: 'G-Z7V0FSGE4Y',
    }),
    metaPixelId: fields.text({
      label: 'Meta Pixel ID',
      description: 'Числовой идентификатор Facebook/Instagram пикселя.',
      defaultValue: '1358428289305229',
    }),
    sameAs: fields.array(fields.url({ label: 'Ссылка на соцсеть' }), {
      label: 'Профили в соцсетях',
      description:
        'Telegram, Instagram, Facebook, YouTube. Используется в schema.org Organization → sameAs (важно для Knowledge Panel в Google).',
      itemLabel: (p) => p.value ?? '',
    }),
  },
})

// ─── 2. HOMEPAGE ────────────────────────────────────────────────────
const homepage = singleton({
  label: 'Главная',
  path: 'content/homepage/',
  format: { data: 'yaml' },
  previewUrl: 'https://graver-studio.uz/ru/',
  schema: {
    hero: fields.object(
      {
        badgeRu: fields.text({ label: 'Плашка над заголовком (RU)' }),
        badgeUz: fields.text({ label: 'Плашка над заголовком (UZ)' }),
        titleRu: fields.text({ label: 'Заголовок H1 (RU)' }),
        titleUz: fields.text({ label: 'Заголовок H1 (UZ)' }),
        titleAccentRu: fields.text({
          label: 'Цветной акцент в заголовке (RU)',
          description: 'Часть заголовка, которая выделяется бирюзовым.',
        }),
        titleAccentUz: fields.text({ label: 'Цветной акцент в заголовке (UZ)' }),
        subtitleRu: fields.text({
          label: 'Подзаголовок (RU)',
          multiline: true,
          description: '1–2 предложения. Главное обещание.',
        }),
        subtitleUz: fields.text({ label: 'Подзаголовок (UZ)', multiline: true }),
        ctaPrimaryRu: fields.text({
          label: 'Кнопка CTA (RU)',
          defaultValue: 'Запросить расчёт',
        }),
        ctaPrimaryUz: fields.text({
          label: 'Кнопка CTA (UZ)',
          defaultValue: "Narx so'rash",
        }),
        stats: fields.array(
          fields.object({
            value: fields.text({
              label: 'Цифра',
              description: 'Например: 7+, 1000+, 24/7',
            }),
            labelRu: fields.text({ label: 'Подпись (RU)' }),
            labelUz: fields.text({ label: 'Подпись (UZ)' }),
          }),
          {
            label: 'Цифры под героем',
            description:
              '3–4 цифры, показывающие масштаб. Например: «7+ лет», «1000+ компаний», «24/7».',
            itemLabel: (p) => `${p.fields.value.value} — ${p.fields.labelRu.value}`,
          }
        ),
      },
      { label: 'Hero (первый экран)' }
    ),

    benefits: fields.array(
      fields.object({
        icon: iconPicker,
        titleRu: fields.text({ label: 'Заголовок (RU)' }),
        titleUz: fields.text({ label: 'Заголовок (UZ)' }),
        descriptionRu: fields.text({ label: 'Описание (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Описание (UZ)', multiline: true }),
      }),
      {
        label: 'Преимущества',
        description: 'Блок «Почему мы» — 4–6 коротких карточек.',
        itemLabel: (p) => p.fields.titleRu.value || '— пусто —',
      }
    ),

    services: fields.array(
      fields.object({
        icon: iconPicker,
        titleRu: fields.text({ label: 'Заголовок (RU)' }),
        titleUz: fields.text({ label: 'Заголовок (UZ)' }),
        descriptionRu: fields.text({ label: 'Описание (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Описание (UZ)', multiline: true }),
      }),
      {
        label: 'Услуги',
        description: '4–6 услуг, что мы делаем.',
        itemLabel: (p) => p.fields.titleRu.value || '— пусто —',
      }
    ),

    portfolio: fields.array(
      fields.object({
        image: fields.image({
          label: 'Фото',
          directory: 'public/images/portfolio',
          publicPath: '/images/portfolio/',
        }),
        categoryRu: fields.text({ label: 'Категория (RU)' }),
        categoryUz: fields.text({ label: 'Категория (UZ)' }),
        titleRu: fields.text({ label: 'Заголовок (RU)' }),
        titleUz: fields.text({ label: 'Заголовок (UZ)' }),
        descriptionRu: fields.text({ label: 'Описание (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Описание (UZ)', multiline: true }),
        materialRu: fields.text({ label: 'Материал (RU)' }),
        materialUz: fields.text({ label: 'Материал (UZ)' }),
        applicationRu: fields.text({ label: 'Применение (RU)' }),
        applicationUz: fields.text({ label: 'Применение (UZ)' }),
      }),
      {
        label: 'Портфолио (кейсы)',
        description: 'Реальные работы. 4–8 карточек.',
        itemLabel: (p) => p.fields.titleRu.value || '— пусто —',
      }
    ),

    processSteps: fields.array(
      fields.object({
        step: fields.text({
          label: 'Номер шага',
          description: 'Например: 01, 02, 03',
        }),
        titleRu: fields.text({ label: 'Название шага (RU)' }),
        titleUz: fields.text({ label: 'Название шага (UZ)' }),
        descriptionRu: fields.text({ label: 'Описание (RU)', multiline: true }),
        descriptionUz: fields.text({ label: 'Описание (UZ)', multiline: true }),
      }),
      {
        label: 'Процесс работы',
        description: 'Как клиент работает с нами: брифинг → макет → производство → доставка.',
        itemLabel: (p) =>
          `${p.fields.step.value || '?'}. ${p.fields.titleRu.value || '— пусто —'}`,
      }
    ),

    faq: fields.array(
      fields.object({
        questionRu: fields.text({ label: 'Вопрос (RU)' }),
        questionUz: fields.text({ label: 'Вопрос (UZ)' }),
        answerRu: fields.text({ label: 'Ответ (RU)', multiline: true }),
        answerUz: fields.text({ label: 'Ответ (UZ)', multiline: true }),
      }),
      {
        label: 'Частые вопросы (FAQ)',
        description:
          'Уходит и в schema.org FAQPage — Google показывает ответы прямо в поиске. 6–10 вопросов идеально.',
        itemLabel: (p) => p.fields.questionRu.value || '— пусто —',
      }
    ),

    seo: seoFields,
  },
})

// ─── 3. PAGES (page builder) ────────────────────────────────────────
const pages = collection({
  label: 'Страницы',
  slugField: 'slug',
  path: 'content/pages/*/',
  format: { data: 'yaml' },
  columns: ['h1', 'locale', 'status'],
  previewUrl: 'https://graver-studio.uz/{locale}/{slug}/',
  schema: {
    slug: fields.slug({
      name: {
        label: 'Идентификатор страницы',
        description:
          'Используется как часть URL: graver-studio.uz/{язык}/{slug}. Только латиница, цифры и дефисы.',
      },
    }),
    locale: fields.select({
      label: 'Язык',
      options: LOCALES as any,
      defaultValue: 'ru',
    }),
    status: fields.select({
      label: 'Статус',
      description: 'Только Опубликованные страницы попадают на сайт и в sitemap.xml.',
      options: STATUS_OPTIONS as any,
      defaultValue: 'draft',
    }),
    h1: fields.text({
      label: 'H1 (главный заголовок страницы)',
      description: 'Виден пользователю в самом верху. Если оставить пустым — будет первый Hero-блок.',
    }),
    intro: fields.text({
      label: 'Подзаголовок / лид',
      multiline: true,
      description: '1–2 предложения сразу под H1. Можно оставить пустым, если первый блок — Hero.',
    }),
    heroImage: fields.image({
      label: 'Главная картинка страницы (опционально)',
      description: 'Используется только если первый блок не Hero.',
      directory: 'public/images/pages',
      publicPath: '/images/pages/',
    }),

    /** Page builder из 6 блоков */
    blocks: fields.array(
      fields.conditional(
        fields.select({
          label: 'Тип блока',
          options: [
            { label: '1. Hero (первый экран)', value: 'hero' },
            { label: '2. Текст / статья', value: 'richText' },
            { label: '3. Сетка преимуществ', value: 'features' },
            { label: '4. Картинка + текст', value: 'imageText' },
            { label: '5. CTA-баннер', value: 'cta' },
            { label: '6. FAQ', value: 'faq' },
          ],
          defaultValue: 'richText',
        }),
        {
          hero: fields.object({
            badge: fields.text({
              label: 'Плашка над заголовком',
              description: 'Например: «Премиум», «Новое», «Спецпредложение».',
            }),
            title: fields.text({ label: 'Заголовок (H1)' }),
            subtitle: fields.text({
              label: 'Подзаголовок',
              multiline: true,
              description: 'Главное обещание в 1–2 предложения.',
            }),
            image: fields.image({
              label: 'Картинка',
              directory: 'public/images/pages',
              publicPath: '/images/pages/',
            }),
            ctaLabel: fields.text({
              label: 'Текст кнопки',
              description: 'Например: «Запросить расчёт», «Посмотреть продукты».',
            }),
            ctaHref: fields.text({
              label: 'Ссылка кнопки',
              description: 'Внутренняя: /ru/contacts/. Внешняя: https://...',
            }),
          }),
          richText: fields.object({
            body: fields.mdx({
              label: 'Текст',
              description:
                'Полноценный редактор с заголовками, списками, картинками, ссылками. Используй для основного смысла страницы.',
              options: {
                image: {
                  directory: 'public/images/pages',
                  publicPath: '/images/pages/',
                },
              },
            }),
          }),
          features: fields.object({
            title: fields.text({ label: 'Заголовок секции' }),
            items: fields.array(
              fields.object({
                icon: iconPicker,
                title: fields.text({ label: 'Заголовок' }),
                description: fields.text({ label: 'Описание', multiline: true }),
              }),
              {
                label: 'Карточки',
                itemLabel: (p) => p.fields.title.value || '— пусто —',
              }
            ),
          }),
          imageText: fields.object({
            image: fields.image({
              label: 'Картинка',
              directory: 'public/images/pages',
              publicPath: '/images/pages/',
            }),
            imageSide: fields.select({
              label: 'Сторона картинки',
              options: [
                { label: 'Слева', value: 'left' },
                { label: 'Справа', value: 'right' },
              ],
              defaultValue: 'left',
            }),
            title: fields.text({ label: 'Заголовок' }),
            body: fields.text({
              label: 'Текст',
              multiline: true,
              description: 'Можно переносы строк. Markdown не работает в этом блоке — для статьи используй блок «Текст».',
            }),
          }),
          cta: fields.object({
            title: fields.text({ label: 'Заголовок CTA' }),
            subtitle: fields.text({ label: 'Подзаголовок' }),
            buttonLabel: fields.text({ label: 'Текст кнопки' }),
            buttonHref: fields.text({ label: 'Ссылка кнопки' }),
          }),
          faq: fields.object({
            title: fields.text({
              label: 'Заголовок секции',
              description: 'По умолчанию: «Частые вопросы».',
            }),
            items: fields.array(
              fields.object({
                q: fields.text({ label: 'Вопрос' }),
                a: fields.text({ label: 'Ответ', multiline: true }),
              }),
              {
                label: 'Вопросы',
                description:
                  'Эти вопросы автоматически уходят в schema.org FAQPage — Google показывает их прямо в выдаче.',
                itemLabel: (p) => p.fields.q.value || '— пусто —',
              }
            ),
          }),
        }
      ),
      {
        label: 'Блоки страницы',
        description: 'Перетаскивай для изменения порядка. Каждый блок — отдельная секция на странице.',
        itemLabel: (p) => {
          const labels: Record<string, string> = {
            hero: 'Hero',
            richText: 'Текст',
            features: 'Сетка',
            imageText: 'Картинка + текст',
            cta: 'CTA',
            faq: 'FAQ',
          }
          return labels[p.discriminant] || p.discriminant
        },
      }
    ),

    /** RU/UZ pair */
    alternateSlug: fields.object(
      {
        ru: fields.text({
          label: 'Slug RU-версии этой страницы',
          description: 'Если у этой страницы есть пара на русском — укажи её slug (без локали).',
        }),
        uz: fields.text({
          label: 'Slug UZ-версии этой страницы',
          description: 'Если у этой страницы есть пара на узбекском — укажи её slug.',
        }),
      },
      {
        label: 'Языковая пара (RU ↔ UZ)',
        description:
          'Указывает Google: эта страница — перевод другой. Используется в hreflang. Если не заполнено — страница считается одиночной.',
      }
    ),

    previousSlugs: previousSlugsField,
    seo: seoFields,
  },
})

// ─── 4. STORIES (blog) ──────────────────────────────────────────────
const stories = collection({
  label: 'Блог / Истории',
  slugField: 'slug',
  // Path uses `**` so that the slug spans two segments: `{locale}/{post}`.
  // Previous `*/*` pattern returned 0 entries because Keystatic
  // only expands a single trailing `*` as slug.
  path: 'content/blog/**',
  format: { contentField: 'content' },
  columns: ['title', 'date', 'category'],
  // Slug for stories is path-encoded (e.g. ru/my-post). Preview opens the
  // blog index — direct deep-link would require slug surgery in Keystatic.
  previewUrl: 'https://graver-studio.uz/{locale}/blog/',
  schema: {
    slug: fields.slug({ name: { label: 'Slug (часть URL)' } }),
    locale: fields.select({
      label: 'Язык',
      options: LOCALES as any,
      defaultValue: 'ru',
    }),
    title: fields.text({
      label: 'Заголовок статьи (H1)',
      description: 'То же, что и SEO Title если не указано иначе.',
      validation: { length: { min: 1 } },
    }),
    description: fields.text({
      label: 'Краткое описание',
      multiline: true,
      description: '2–3 предложения. Используется в превью на /blog и как fallback для meta description.',
    }),
    date: fields.text({
      label: 'Дата публикации',
      description: 'Формат ISO: 2026-03-15. Влияет на сортировку и schema.org datePublished.',
    }),
    author: fields.text({ label: 'Автор', defaultValue: 'Graver.uz' }),
    category: fields.text({
      label: 'Категория',
      description: 'Например: Корпоративные подарки, Welcome-pack, Гравировка.',
    }),
    tags: fields.array(fields.text({ label: 'Тег' }), {
      label: 'Теги',
      itemLabel: (p) => p.value,
    }),
    relatedSlugs: fields.array(fields.text({ label: 'Slug связанной статьи' }), {
      label: 'Похожие статьи',
      description:
        'Slugs других постов, которые показываются в блоке «Похожее» внизу. 2–4 штуки оптимально.',
      itemLabel: (p) => p.value,
    }),
    alternateSlug: fields.object(
      {
        ru: fields.text({ label: 'Slug RU-версии этой статьи' }),
        uz: fields.text({ label: 'Slug UZ-версии этой статьи' }),
      },
      {
        label: 'Языковая пара (RU ↔ UZ)',
        description: 'Если у статьи есть перевод — укажи slug. Используется в hreflang.',
      }
    ),
    faq: fields.array(
      fields.object({
        q: fields.text({ label: 'Вопрос' }),
        a: fields.text({ label: 'Ответ', multiline: true }),
      }),
      {
        label: 'FAQ статьи',
        description:
          'Опционально. Если заполнить — уходит в schema.org FAQPage и показывается в Google.',
        itemLabel: (p) => p.fields.q.value || '— пусто —',
      }
    ),
    ogTitle: fields.text({
      label: 'OG Title (для соцсетей)',
      description: 'Если пусто — берётся обычный заголовок.',
    }),
    ogDescription: fields.text({
      label: 'OG Description (для соцсетей)',
      multiline: true,
    }),
    ogImage: fields.text({
      label: 'OG-картинка (путь)',
      description: 'Например: /images/blog/my-article-cover.jpg',
    }),
    noindex: fields.checkbox({
      label: 'Скрыть от Google (noindex)',
      description: 'Только для технических постов или дублей.',
      defaultValue: false,
    }),
    canonicalOverride: fields.text({
      label: 'Canonical (продвинутый режим)',
      description:
        'Только если эта статья — копия другой канонической. Полная ссылка. Не трогай если не уверен.',
    }),
    previousSlugs: previousSlugsField,
    content: fields.mdx({
      label: 'Текст статьи',
      options: {
        image: {
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        },
      },
    }),
  },
})

// ─── 5. PRODUCTS ────────────────────────────────────────────────────
const products = collection({
  label: 'Продукты',
  slugField: 'slug',
  path: 'content/products/*/',
  format: { data: 'yaml' },
  columns: ['nameRu', 'availability', 'status'],
  previewUrl: 'https://graver-studio.uz/ru/products/{slug}/',
  schema: {
    slug: fields.slug({
      name: {
        label: 'URL продукта',
        description: 'graver-studio.uz/{язык}/products/{slug}. Только латиница и дефисы.',
      },
    }),
    status: fields.select({
      label: 'Статус',
      options: STATUS_OPTIONS as any,
      defaultValue: 'draft',
    }),
    // Идентификация
    nameRu: fields.text({ label: 'Название (RU)' }),
    nameUz: fields.text({ label: 'Название (UZ)' }),
    descriptionRu: fields.text({
      label: 'Описание (RU)',
      multiline: true,
      description: '2–4 предложения. Что это, для кого, ключевые материалы и тираж.',
    }),
    descriptionUz: fields.text({ label: 'Описание (UZ)', multiline: true }),
    brand: fields.text({ label: 'Бренд / производитель' }),

    // Визуал
    heroImage: fields.image({
      label: 'Главное фото',
      description: 'Лицо продукта. Используется в hero и schema.org Product.image.',
      directory: 'public/images/products',
      publicPath: '/images/products/',
    }),
    gallery: fields.array(
      fields.image({
        label: 'Фото',
        directory: 'public/images/products',
        publicPath: '/images/products/',
      }),
      {
        label: 'Галерея',
        description: 'Дополнительные фото: разные ракурсы, варианты исполнения, кейсы.',
        itemLabel: (p) => (typeof p.value === 'string' ? p.value : 'Фото'),
      }
    ),

    // Коммерческое
    availability: fields.select({
      label: 'Наличие',
      description: 'Влияет на schema.org Offer.availability — Google показывает «В наличии».',
      options: [
        { label: 'В наличии', value: 'InStock' },
        { label: 'Под заказ (PreOrder)', value: 'PreOrder' },
        { label: 'Нет в наличии', value: 'OutOfStock' },
      ],
      defaultValue: 'InStock',
    }),
    minBatchSize: fields.number({
      label: 'Минимальный тираж (штук)',
      description: '«От N штук». Если штучно — поставь 1.',
    }),
    pricingTiers: fields.array(
      fields.object({
        nameRu: fields.text({ label: 'Название модели (RU)' }),
        nameUz: fields.text({ label: 'Название модели (UZ)' }),
        price: fields.number({
          label: 'Цена (число, в сумах)',
          description: 'Только цифры. Используется в schema.org. Например: 140000',
        }),
        priceDisplay: fields.text({
          label: 'Цена (для показа)',
          description: 'Как пользователь увидит. Например: «140 000 сум».',
        }),
        descRu: fields.text({ label: 'Краткая характеристика (RU)' }),
        descUz: fields.text({ label: 'Краткая характеристика (UZ)' }),
        highlight: fields.checkbox({
          label: 'Выделить «Хит / Рекомендуем»',
          defaultValue: false,
        }),
      }),
      {
        label: 'Варианты / тарифы',
        description: 'Разные модели или тарифы продукта с ценами.',
        itemLabel: (p) =>
          `${p.fields.nameRu.value || '— пусто —'}  ·  ${p.fields.priceDisplay.value || ''}`,
      }
    ),

    // Доверие
    aggregateRating: fields.object(
      {
        value: fields.text({
          label: 'Средняя оценка',
          description: 'Например: 4.9. Должна быть подкреплена реальными отзывами.',
        }),
        count: fields.text({
          label: 'Количество отзывов',
          description: 'Например: 47',
        }),
      },
      {
        label: 'Сводный рейтинг (для Google звёзды)',
        description: 'Уходит в schema.org AggregateRating. Не выдумывай цифры — Google карает.',
      }
    ),
    reviews: fields.array(
      fields.object({
        authorName: fields.text({
          label: 'Автор / компания',
          description: 'Например: Beeline Uzbekistan, Иван П.',
        }),
        rating: fields.number({
          label: 'Оценка (1–5)',
          description: 'Целое число от 1 до 5.',
        }),
        textRu: fields.text({ label: 'Отзыв (RU)', multiline: true }),
        textUz: fields.text({ label: 'Отзыв (UZ)', multiline: true }),
      }),
      {
        label: 'Отзывы',
        description:
          'Отображаются на странице и идут в schema.org Review. Реальные клиенты — реальные имена.',
        itemLabel: (p) =>
          `${p.fields.authorName.value || '— автор —'}  ·  ${p.fields.rating.value ?? '?'}/5`,
      }
    ),
    trustBadgesRu: fields.array(fields.text({ label: 'Бейдж (RU)' }), {
      label: 'Бейджи доверия (RU)',
      description: 'Короткие фразы под фото. Например: «Гарантия 1 год», «Тираж от 1 шт».',
      itemLabel: (p) => p.value,
    }),
    trustBadgesUz: fields.array(fields.text({ label: 'Бейдж (UZ)' }), {
      label: 'Бейджи доверия (UZ)',
      itemLabel: (p) => p.value,
    }),

    // Особенности
    featuresRu: fields.array(fields.text({ label: 'Особенность (RU)' }), {
      label: 'Особенности продукта (RU)',
      description: '4–8 коротких булетов. То, что отличает от конкурентов.',
      itemLabel: (p) => p.value,
    }),
    featuresUz: fields.array(fields.text({ label: 'Особенность (UZ)' }), {
      label: 'Особенности продукта (UZ)',
      itemLabel: (p) => p.value,
    }),

    // Процесс
    processStepsRu: fields.array(fields.text({ label: 'Шаг (RU)' }), {
      label: 'Этапы заказа (RU)',
      description: 'Как клиент проходит путь до получения. 3–5 шагов.',
      itemLabel: (p) => p.value,
    }),
    processStepsUz: fields.array(fields.text({ label: 'Шаг (UZ)' }), {
      label: 'Этапы заказа (UZ)',
      itemLabel: (p) => p.value,
    }),

    // FAQ
    faq: fields.array(
      fields.object({
        qRu: fields.text({ label: 'Вопрос (RU)' }),
        qUz: fields.text({ label: 'Вопрос (UZ)' }),
        aRu: fields.text({ label: 'Ответ (RU)', multiline: true }),
        aUz: fields.text({ label: 'Ответ (UZ)', multiline: true }),
      }),
      {
        label: 'FAQ продукта',
        description:
          'Уходит в schema.org FAQPage. Закрывает возражения покупателя: сроки, тираж, гарантия, доставка.',
        itemLabel: (p) => p.fields.qRu.value || '— пусто —',
      }
    ),

    previousSlugs: previousSlugsField,
    seo: seoFields,
  },
})

// ─── CONFIG ─────────────────────────────────────────────────────────
const useGithub =
  process.env.KEYSTATIC_STORAGE === 'github' ||
  Boolean(process.env.CF_PAGES) ||
  Boolean(process.env.CLOUDFLARE_ENV) ||
  Boolean(process.env.KEYSTATIC_GITHUB_FORCE)

export default config({
  storage: useGithub
    ? {
        kind: 'github',
        repo: { owner: 'braindiggeruz', name: 'graveruz-nextjs' },
      }
    : { kind: 'local' },
  ui: {
    brand: {
      name: 'Graver Studio',
      mark: GraverMark,
    },
    navigation: {
      'Каждый день': ['homepage', 'stories', 'pages'],
      Каталог: ['products'],
      Система: ['settings'],
    },
  },
  singletons: { settings, homepage },
  collections: { pages, stories, products },
})
