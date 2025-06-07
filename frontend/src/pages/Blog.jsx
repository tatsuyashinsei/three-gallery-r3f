import { useEffect, useState } from 'react'
import { getBlogList } from '@/lib/blogApi'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogList()
        setPosts(data)
      } catch {
        setError('記事の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/main" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            メインページに戻る
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <Link to="/main" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            メインページに戻る
          </Link>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-error">{error}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">ブログ記事一覧</h1>
            <p className="text-base-content/60">
              新星(仮)の最新情報をお届けします
            </p>
          </div>
          <Link to="/main" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            戻る
          </Link>
        </div>

        {/* 記事グリッド */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.id}
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <figure className="aspect-video bg-base-300">
                <img
                  src={post.thumbnail?.url || DEFAULT_THUMBNAIL}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_THUMBNAIL
                  }}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title line-clamp-2">{post.title}</h2>
                <time className="text-sm text-base-content/60">
                  {new Date(post.published_at).toLocaleDateString('ja-JP')}
                </time>
                {post.excerpt && (
                  <p className="text-base-content/80 line-clamp-2">{post.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* 記事がない場合 */}
        {posts.length === 0 && (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-base-content/60">まだ記事がありません</p>
          </div>
        )}
      </div>
    </div>
  )
} 