import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, Home, MessageSquare, User, Box, BookOpen } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* ロゴ（家アイコン）＋タイトル */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">就労継続支援Ｂ型 新星(仮)</h1>
          </Link>

          {/* ナビゲーションボタン */}
          <div className="flex items-center gap-2">
            <Link to="/main" className="btn btn-sm gap-2 transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">ホーム</span>
            </Link>

            <Link to="/gallery" className="btn btn-sm gap-2 transition-colors">
              <Box className="w-4 h-5" />
              <span className="hidden sm:inline">3D</span>
            </Link>

            <Link to="/blog" className="btn btn-sm gap-2 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">ブログ</span>
            </Link>

            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">プロフィール</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">ログアウト</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
