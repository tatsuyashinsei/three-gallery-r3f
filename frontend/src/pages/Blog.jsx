import { useEffect, useState } from 'react'
import { getBlogList } from '@/lib/blogApi'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_THUMBNAIL = '/images/default-thumbnail.jpg'

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center items-center gap-2">
    <button
      className="btn btn-circle btn-sm"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeft size={16} />
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`btn btn-circle btn-sm ${
          currentPage === page ? 'btn-primary' : ''
        }`}
        onClick={() => onPageChange(page)}
      >
        {page}
      </button>
    ))}
    <button
      className="btn btn-circle btn-sm"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
    >
      <ChevronRight size={16} />
    </button>
  </div>
)

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const [posts, setPosts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogList(currentPage)
        setPosts(data.contents)
        setTotalPages(Math.ceil(data.totalCount / data.limit))
      } catch {
        setError('記事の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [currentPage])

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">コラム一覧</h1>
            <p className="text-base-content/60">
              旬の記事をお届けします
            </p>
          </div>
          <Link to="/main" className="btn btn-ghost btn-sm gap-2">
            <ArrowLeft size={16} />
            戻る
          </Link>
        </div>

        {/* 上部ページネーション */}
        {totalPages > 1 && (
          <div className="mb-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

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

        {/* 下部ページネーション */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* 記事がない場合 */}
        {posts.length === 0 && !loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-base-content/60">まだ記事がありません</p>
          </div>
        )}
      </div>
    </div>
  )
} 