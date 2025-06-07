import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getBlogBySlug } from '@/lib/blogApi'

const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogBySlug(slug)
        if (!data) {
          setError('記事が見つかりませんでした')
          return
        }
        setPost(data)
      } catch (err) {
        setError('記事の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-center">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-red-500">{error}</p>
      <Link to="/blog" className="text-blue-500 hover:underline mt-4 inline-block">
        ← ブログ一覧に戻る
      </Link>
    </div>
  )

  if (!post) return null

  return (
    <article className="p-6 max-w-3xl mx-auto">
      <Link to="/blog" className="text-blue-500 hover:underline mb-4 inline-block">
        ← ブログ一覧に戻る
      </Link>
      
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      
      <p className="text-sm text-gray-500 mb-6">
        {new Date(post.published_at).toLocaleDateString('ja-JP')}
      </p>

      <img 
        src={post.thumbnail?.url || DEFAULT_THUMBNAIL} 
        alt={post.title}
        className="w-full h-80 object-cover mb-8 rounded-lg"
        onError={(e) => {
          e.target.src = DEFAULT_THUMBNAIL
        }}
      />

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
} 