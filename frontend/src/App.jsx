import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage"; // ← 元 HomePage を改名
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import GalleryPage from "./pages/GalleryPage";
import GalleryCanvas1_1 from "./pages/GalleryCanvas1_1";
import GalleryCanvas2 from "./pages/GalleryCanvas2";
import GalleryCanvas3 from "./pages/GalleryCanvas3";
import GalleryCanvas4 from "./pages/GalleryCanvas4"; // ✅ 追加
import GalleryCanvas3_1 from "./pages/GalleryCanvas3_1";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ColumnsPage from "./pages/Columns";
import NotionArticleDetail from "./pages/NotionArticles/ArticleDetail";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col">
      <Navbar />

      <Routes>
        {/* ✅ トップページ、Main、Settings、Columns は未ログインでも表示可 */}
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/columns" element={<ColumnsPage />} />

        {/* ✅ Gallery 関連も全て未ログインでOK */}
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/canvas1_1" element={<GalleryCanvas1_1 />} />
        <Route path="/gallery/canvas2" element={<GalleryCanvas2 />} />
        <Route path="/gallery/canvas3" element={<GalleryCanvas3 />} />
        <Route path="/gallery/canvas4" element={<GalleryCanvas4 />} />
        <Route path="/gallery/canvas3_1" element={<GalleryCanvas3_1 />} />

        {/* ✅ Notion 関連 */}
        <Route path="/columns/:id" element={<NotionArticleDetail />} />

        {/* 🔐 ログイン状態に応じて分岐するページ */}
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );

};

export default App;
