import "./globals.css";

export default async function Home() {
  // Загружаем посты с параметром _embed, чтобы подтянулись картинки
  const res = await fetch('http://co-coffee.test/wp-json/wp/v2/posts?per_page=5&_embed', {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    return <main className="p-8"><h1 className="text-red-500">Ошибка загрузки постов</h1></main>
  }

  const posts = await res.json()

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Заголовок страницы */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📰 Блог</h1>
          <p className="text-gray-600">Последние записи</p>
        </div>

        {/* Сетка постов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {posts.map((post: any) => (
            // ССЫЛКА-ОБЁРТКА: делает всю карточку кликабельной
            <a
              key={post.id}
              href={`/posts/${post.slug}`}
              className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Картинка поста */}
              {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post._embedded['wp:featuredmedia'][0].source_url}
                    alt={post.title.rendered}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Дата */}
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>

                {/* Заголовок (без ссылки, так как вся карточка уже ссылка) */}
                <h2
                  className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />

                {/* Отрывок */}
                <div
                  className="text-gray-600 text-sm mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />

                {/* Кнопка "Читать" (просто текст, без тега <a>) */}
                <span className="inline-flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                  Читать далее
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
          
        </div>
      </div>
    </main>
  )
}