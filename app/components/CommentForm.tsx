'use client'
import { useState } from 'react'

export default function CommentForm({ postId, postLink }: { postId: number; postLink: string }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            // 1. ПОЛУЧАЕМ НОНС ИЗ НАШЕГО ОТКРЫТОГО ИСТОЧНИКА
            // Важно: адрес должен совпадать с тем, что мы написали в PHP
            const nonceRes = await fetch('/wp-json/my-theme/v1/nonce')
            const nonceData = await nonceRes.json()
            const nonce = nonceData.nonce

            if (!nonce) {
                throw new Error('Не удалось получить токен безопасности')
            }

            // 2. ОТПРАВЛЯЕМ КОММЕНТАРИЙ С ЭТИМ НОНСОМ
            const res = await fetch('/wp-json/wp/v2/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce, // Передаем полученный токен
                },
                body: JSON.stringify({
                    post: postId,
                    author_name: name,
                    author_email: email,
                    content: content,
                }),
            })
 
            const data = await res.json()

            if (!res.ok) {
                // Если WP все еще ругается, смотрим точную ошибку
                throw new Error(data.message || 'Ошибка отправки')
            }

            setSuccess(true)
            setName('')
            setEmail('')
            setContent('')

            setTimeout(() => window.location.reload(), 2000)
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Не удалось отправить комментарий')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Комментарий *</label>
                <textarea id="comment" value={content} onChange={(e) => setContent(e.target.value)} required rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">✅ Комментарий отправлен! Страница перезагрузится...</div>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Отправка...' : '📤 Отправить комментарий'}
            </button>
        </form>
    )
}