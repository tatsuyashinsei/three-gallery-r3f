import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogBySlug } from '@/lib/blogApi'
import { ArrowLeft } from 'lucide-react'

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
      } catch {
        setError('記事の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/blog" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            戻る
          </Link>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/blog" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            戻る
          </Link>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-error">{error}</p>
        </div>
      </div>
    </div>
  )

  if (!post) return null

  return (
    <article className="min-h-screen pt-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/blog" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            戻る
          </Link>
        </div>
        <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-base-200">
          <img 
            src={post.thumbnail?.url || DEFAULT_THUMBNAIL} 
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = DEFAULT_THUMBNAIL
            }}
          />
        </div>
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4">
            <time className="text-sm text-base-content/60">
              {new Date(post.published_at).toLocaleDateString('ja-JP')}
            </time>
          </div>
        </div>
        <div 
          className="prose prose-invert prose-img:rounded-lg prose-img:w-full prose-img:aspect-video prose-img:object-cover max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="mt-16 pt-8 border-t border-base-300">
          <Link to="/blog" className="btn btn-ghost gap-2">
            <ArrowLeft size={16} />
            記事一覧に戻る
          </Link>
        </div>
      </div>
    </article>
  )
} 