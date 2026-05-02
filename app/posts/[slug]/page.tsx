import CommentForm from "@/app/components/CommentForm";

export async function generateStaticParams() {
    const res = await fetch('http://co-coffee.test/wp-json/wp/v2/posts?per_page=100', {
        next: { revalidate: 3600 } // Обновляем раз в час
    })

    const posts = await res.json()

    return posts.map((post: any) => ({
        slug: post.slug,
    }))
}

// Компонент страницы
export default async function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = await params // В Next.js 15 params теперь промис

    // Получаем конкретный пост по slug
    const res = await fetch(`http://co-coffee.test/wp-json/wp/v2/posts?slug=${slug}`, {
        next: { revalidate: 60 }
    })


    if (!res.ok) return <div>Post not found</div>

    const posts = await res.json()
    const post = posts[0]
    const commentsRes = await fetch(`http://co-coffee.test/wp-json/wp/v2/comments?post=${post.id}&status=approve`, {
        next: { revalidate: 60 }
    })
    const comments = await commentsRes.json()
    if (!post) return <div>Post not found</div>

    return (
  <main className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-3xl mx-auto">
      
      {/* Карточка поста */}
      <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <img
            src={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post.title.rendered}
            className="w-full h-64 md:h-96 object-cover"
          />
        )}

        <div className="p-8 md:p-12">
          <a href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к блогу
          </a>
          
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} 
          />
          
          <div className="flex items-center text-gray-500 text-sm mb-8 pb-8 border-b">
            <span>📅 {new Date(post.date).toLocaleDateString('ru-RU')}</span>
            {post._embedded?.author?.[0]?.name && (
              <span className="ml-4">✍️ {post._embedded.author[0].name}</span>
            )}
          </div>
          
          <div
            className="prose prose-lg max-w-none text-gray-700 
                       prose-headings:font-bold prose-a:text-blue-600 
                       prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </article>

      {/* Карточка комментариев (в том же контейнере!) */}
      <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h3 className="text-2xl font-bold mb-6">💬 Комментарии ({comments.length})</h3>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{comment.author_name || 'Аноним'}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(comment.date).toLocaleDateString('ru-RU')}
                </p>
                <div 
                  className="text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{ __html: comment.content.rendered }} 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Пока нет комментариев. Будьте первым! 🎉</p>
        )}

        {/* Кнопка на форму в WP */}
        <CommentForm postId={post.id} postLink={post.link} />
      </section>

    </div>
  </main>
)
}