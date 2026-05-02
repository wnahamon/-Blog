// components/Header.tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Логотип */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          ☕ Блог
        </Link>
        {/* Смена темы */}


        
        {/* Навигация */}
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
            Блог
          </Link>
          {/* <a href="http://co-coffee.test/wp-admin" target="_blank" className="text-sm text-gray-400 hover:text-gray-600">
            Вход для админа →
          </a> */}
        </nav>
        
      </div>
    </header>
  )
}