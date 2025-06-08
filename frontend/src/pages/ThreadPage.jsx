import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useBoardStore } from "../store/useBoardStore";
import { ArrowLeft, Send, Clock, User, MessageCircle } from "lucide-react";

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

const ThreadPage = () => {
  const { threadId } = useParams();
  const { authUser } = useAuthStore();
  const { currentThread, posts, isLoading, getThread, getPosts, createPost } = useBoardStore();
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    if (threadId) {
      getThread(threadId);
      getPosts(threadId);
    }
  }, [threadId, getThread, getPosts]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await createPost(threadId, {
        content: newPostContent.trim(),
      });
      setNewPostContent("");
    } catch (error) {
      console.error("Failed to create post:", error);
      
      // 投稿制限に達した場合の処理
      if (error.requireLogin) {
        setTimeout(() => {
          if (confirm("アカウント登録すると無制限で投稿できます。登録ページに移動しますか？")) {
            window.location.href = "/signup";
          }
        }, 1000);
      }
    }
  };

  // 非ログインユーザーでも閲覧・投稿可能

  if (isLoading && !currentThread) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!currentThread) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">スレッドが見つかりません</h2>
          <Link to="/board" className="btn btn-primary">
            掲示板に戻る
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3 mb-4">
            <Link to="/board" className="btn btn-ghost btn-sm">
              <ArrowLeft size={16} />
              掲示板に戻る
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{currentThread.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{currentThread.author?.fullName || "匿名"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>
                {formatTimeAgo(currentThread.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-4 mb-6">
          {/* 1番目: スレッド作成投稿 */}
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="badge badge-primary">1</div>
              <span className="font-semibold">{currentThread.author?.fullName || "匿名"}</span>
              <span className="text-sm text-base-content/60">
                {formatTimeAgo(currentThread.createdAt)}
              </span>
            </div>
            <div className="whitespace-pre-wrap">{currentThread.content}</div>
          </div>

          {/* その他の投稿 */}
          {posts.map((post, index) => (
            <div key={post._id} className="bg-base-100 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="badge badge-ghost">{index + 2}</div>
                <span className="font-semibold">{post.author?.fullName || "匿名"}</span>
                <span className="text-sm text-base-content/60">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          ))}
        </div>

        {/* 投稿フォーム */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            レスを投稿
            {!authUser && (
              <span className="text-sm text-warning ml-2">
                (ゲスト: 1日5回まで)
                <Link to="/login" className="link link-primary ml-2">
                  ログインして無制限で投稿する
                </Link>
              </span>
            )}
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="あなたの意見を書いてください..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              maxLength={1000}
            ></textarea>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">
                {newPostContent.length}/1000文字
              </span>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!newPostContent.trim()}
              >
                <Send size={16} />
                投稿
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThreadPage; 