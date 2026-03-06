import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="ru">
      <body className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-teal-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Страница не найдена</h2>
          <p className="text-gray-400 mb-8">Запрошенная страница не существует.</p>
          <Link
            href="/ru"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            На главную
          </Link>
        </div>
      </body>
    </html>
  )
}
