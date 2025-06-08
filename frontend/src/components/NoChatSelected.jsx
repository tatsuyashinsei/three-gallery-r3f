import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const NoChatSelected = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <MessageSquare className="w-8 h-8 text-primary " />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">チャットルームを選択</h2>
        <p className="text-base-content/60">
          左のサイドバーからお相手を選択してチャットを始めましょう
        </p>

        {/* 非ログイン状態でのログインリンク */}
        {!authUser && (
          <div className="mt-6 p-4 bg-base-200 rounded-lg">
            <p className="text-sm text-base-content/70 mb-2">
              チャット機能を利用するにはログインが必要です
            </p>
            <Link 
              to="/login" 
              className="link link-primary text-sm font-medium"
            >
              ログインページへ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoChatSelected;
