import { useEffect, useState } from 'react'
import { getBlogList } from '@/lib/blogApi'
import { Link } from 'react-router-dom'

const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg' // デフォルトサムネイル画像のパス

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogList()
        setPosts(data)
      } catch (err) {
        setError('記事の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  if (loading) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-center">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-red-500">{error}</p>
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ブログ一覧</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id}>
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition duration-300">
              <img 
                src={post.thumbnail?.url || DEFAULT_THUMBNAIL} 
                alt={post.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = DEFAULT_THUMBNAIL
                }}
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(post.published_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 