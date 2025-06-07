import { Routes, Route } from 'react-router-dom'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
// ... 他の既存のimport文

export default function App() {
  return (
    <Routes>
      {/* 既存のルート */}
      <Route path="/" element={<Home />} />
      {/* ブログルート */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Routes>
  )
} 