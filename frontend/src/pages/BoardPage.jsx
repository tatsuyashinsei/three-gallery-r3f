import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useBoardStore } from "../store/useBoardStore";
import { Plus, MessageSquare, Clock, User, ArrowLeft, MessageCircle } from "lucide-react";

// 日付フォーマット用のヘルパー関数
const formatTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays}日前`;
  } else if (diffHours > 0) {
    return `${diffHours}時間前`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes > 0 ? `${diffMinutes}分前` : `今`;
  }
};

const BoardPage = () => {
  const { authUser } = useAuthStore();
  const { threads, isLoading, getThreads, createThread } = useBoardStore();
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    getThreads();
  }, [getThreads]);

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;

    try {
      await createThread({
        title: newThreadTitle.trim(),
        content: newThreadContent.trim(),
      });
      setNewThreadTitle("");
      setNewThreadContent("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create thread:", error);
      
      // 投稿制限に達した場合の処理
      if (error.requireLogin) {
        // ログイン促進のモーダルを表示（簡易版）
        setTimeout(() => {
          if (confirm("アカウント登録すると無制限で投稿できます。登録ページに移動しますか？")) {
            window.location.href = "/signup";
          }
        }, 1000);
      }
    }
  };

  // 非ログインユーザーでも掲示板は閲覧可能

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-4xl mx-auto p-4">
        {/* チャットルームリンク */}
        {authUser && (
          <div className="mb-4">
            <Link to="/" className="btn btn-secondary btn-sm">
              <MessageCircle size={16} />
              チャットルーム
            </Link>
          </div>
        )}
        
        {/* ヘッダー */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/main" className="btn btn-ghost btn-sm">
                <ArrowLeft size={16} />
                戻る
              </Link>
              <h1 className="text-2xl font-bold">💬 掲示板</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              新スレッド作成
            </button>
          </div>

          <p className="text-base-content/60">
            自由に議論・情報交換を行いましょう
            {!authUser && (
              <span className="block mt-2 text-sm text-warning">
                ゲストユーザーは1日5回まで投稿可能です
                <Link to="/login" className="link link-primary ml-2">
                  ログインして無制限で投稿する
                </Link>
              </span>
            )}
          </p>
        </div>

        {/* 新スレッド作成フォーム */}
        {showCreateForm && (
          <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">新しいスレッドを作成</h2>
            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">スレッドタイトル</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="話題のタイトルを入力..."
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  maxLength={100}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">最初の投稿内容</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  placeholder="議論のきっかけとなる内容を書いてください..."
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  maxLength={1000}
                ></textarea>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn btn-ghost"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                >
                  作成
                </button>
              </div>
            </form>
          </div>
        )}

        {/* スレッド一覧 */}
        <div className="bg-base-100 rounded-lg shadow-lg">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="loading loading-spinner loading-lg"></div>
              <p className="mt-2">読み込み中...</p>
            </div>
          ) : threads.length === 0 ? (
            <div className="p-8 text-center text-base-content/60">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>まだスレッドがありません</p>
              <p className="text-sm">最初のスレッドを作成してみましょう！</p>
            </div>
          ) : (
            <div className="divide-y divide-base-300">
              {threads.map((thread) => (
                <div key={thread._id} className="p-4 hover:bg-base-200 transition-colors">
                  <Link
                    to={`/board/thread/${thread._id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-base-content/60">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{thread.author?.fullName || "匿名"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>
                              {formatTimeAgo(thread.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare size={14} />
                            <span>{thread.postCount || 0} レス</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage; 