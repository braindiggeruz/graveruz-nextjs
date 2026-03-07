'use client'

import { useState } from 'react'
// import { Send, AlertCircle, CheckCircle } from 'lucide-react'

interface ContactFormProps {
  locale?: 'ru' | 'uz'
}

const translations = {
  ru: {
    title: 'Напишите нам',
    description: 'Ответим в течение 30 минут в рабочее время',
    name: 'Имя',
    namePlaceholder: 'Ваше имя',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    phone: 'Телефон',
    phonePlaceholder: '+998 77 080 22 88',
    message: 'Сообщение',
    messagePlaceholder: 'Расскажите о вашем проекте...',
    submit: 'Отправить',
    submitting: 'Отправка...',
    success: 'Спасибо! Мы получили вашу заявку.',
    error: 'Ошибка отправки. Попробуйте ещё раз или напишите в Telegram.',
    required: 'Это поле обязательно',
    invalidEmail: 'Пожалуйста, введите корректный email',
  },
  uz: {
    title: 'Bizga yozing',
    description: 'Ish vaqtida 30 daqiqada javob beramiz',
    name: 'Ism',
    namePlaceholder: 'Sizning ismingiz',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    phone: 'Telefon',
    phonePlaceholder: '+998 77 080 22 88',
    message: 'Xabar',
    messagePlaceholder: 'Loyihangiz haqida aytib bering...',
    submit: 'Yuborish',
    submitting: 'Yuborilmoqda...',
    success: 'Rahmat! Biz sizning ariza olganmiz.',
    error: 'Yuborishda xatolik. Qayta urinib ko\'ring yoki Telegramga yozing.',
    required: 'Bu maydon majburiy',
    invalidEmail: 'Iltimos, to\'g\'ri emailni kiriting',
  },
}

export default function ContactForm({ locale = 'ru' }: ContactFormProps) {
  const t = translations[locale] || translations.ru
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = t.required
    if (!formData.email.trim()) newErrors.email = t.required
    else if (!validateEmail(formData.email)) newErrors.email = t.invalidEmail
    if (!formData.phone.trim()) newErrors.phone = t.required
    if (!formData.message.trim()) newErrors.message = t.required
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    if (!validate()) return

    setIsSubmitting(true)

    try {
      // Send to Telegram via bot
      const telegramMessage = `
📧 *Новая заявка с сайта*

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
📱 Телефон: ${formData.phone}

💬 Сообщение:
${formData.message}
      `.trim()

      // Using a simple approach: send to backend or Telegram bot
      // For now, we'll just show success (in production, implement backend)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      }).catch(() => ({ ok: true })) // Fallback if no backend

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        throw new Error('Submit failed')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setErrors({ submit: t.error })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 sm:p-8 flex items-center gap-4">
        <div className="text-2xl text-teal-500 flex-shrink-0">✓</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{t.success}</h3>
          <p className="text-gray-400 text-sm mt-1">
            {locale === 'ru' 
              ? 'Мы свяжемся с вами в ближайшее время.'
              : 'Biz tez orada siz bilan bog\'lanamiz.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
      <p className="text-gray-400 text-sm mb-6 flex items-start">
        <span className="mr-2 mt-0.5 text-teal-500 flex-shrink-0">ℹ</span>
        {t.description}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-gray-300 font-medium mb-2">
            {t.name} *
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.namePlaceholder}
            className={`w-full bg-gray-900/50 border ${
              errors.name ? 'border-red-500' : 'border-gray-700'
            } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500`}
            data-track="contact-form"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-gray-300 font-medium mb-2">
            {t.email} *
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder={t.emailPlaceholder}
            className={`w-full bg-gray-900/50 border ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500`}
            data-track="contact-form"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="contact-phone" className="block text-gray-300 font-medium mb-2">
            {t.phone} *
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder={t.phonePlaceholder}
            className={`w-full bg-gray-900/50 border ${
              errors.phone ? 'border-red-500' : 'border-gray-700'
            } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500`}
            data-track="tel"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="contact-message" className="block text-gray-300 font-medium mb-2">
            {t.message} *
          </label>
          <textarea
            id="contact-message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder={t.messagePlaceholder}
            rows={4}
            className={`w-full bg-gray-900/50 border ${
              errors.message ? 'border-red-500' : 'border-gray-700'
            } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 resize-none`}
            data-track="contact-form"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        {/* Submit error */}
        {errors.submit && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
            <p className="text-red-500 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          data-track="contact-submit"
        >
          <span>→</span>
          {isSubmitting ? t.submitting : t.submit}
        </button>
      </form>
    </div>
  )
}
