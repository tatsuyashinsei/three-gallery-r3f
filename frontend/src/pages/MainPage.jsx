import { Link } from "react-router-dom";
import { Palette, FileText, Briefcase, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedTitle from "../components/AnimatedTitle";

const MainPage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-start p-6 space-y-10 pt-24">
      {/* スライダー */}
      <div className="carousel w-full max-w-3xl rounded-xl shadow-lg overflow-hidden">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264644/samples/imagecon-group.jpg"
            className="w-full object-cover"
            alt="slide 1"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronLeft size={20} />
            </a>
            <a href="#slide2" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronRight size={20} />
            </a>
          </div>
        </div>

        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/people/bicycle.jpg"
            className="w-full object-cover"
            alt="slide 2"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronLeft size={20} />
            </a>
            <a href="#slide3" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronRight size={20} />
            </a>
          </div>
        </div>

        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/animals/three-dogs.jpg"
            className="w-full object-cover"
            alt="slide 3"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronLeft size={20} />
            </a>
            <a href="#slide1" className="btn btn-circle bg-white/20 hover:bg-white/30 border-white/30 text-white">
              <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* メニュー見出し */}
      <div className="flex justify-center">
        <AnimatedTitle text="おかえりなさい" />
      </div>
      
      {/* メニューリンク */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-xl">
        <Link
          to="/settings"
          className="btn btn-primary w-full flex gap-2 items-center justify-center scale-90"
        >
          <Palette size={18} />
          配色テーマ
        </Link>

        <Link
          to="/blog"
          className="btn btn-secondary w-full flex gap-2 items-center justify-center scale-90"
        >
          <FileText size={18} />
          コラム
        </Link>

        <Link
          to="/about"
          className="btn btn-accent w-full flex gap-2 items-center justify-center scale-90"
        >
          <Briefcase size={18} />
          事業所紹介
        </Link>
      </div>

      {/* チャットログインリンク */}
      <div className="mt-12">
        <Link
          to="/login"
          className="btn btn-outline btn-wide flex gap-2 items-center"
        >
          <MessageSquare size={20} />
          チャット
        </Link>
      </div>
    </div>
  );
};

export default MainPage;
