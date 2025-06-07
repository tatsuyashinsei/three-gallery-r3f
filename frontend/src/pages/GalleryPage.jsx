// GalleryPage.jsx

// GalleryPage.jsx

import { Link } from "react-router-dom";
import CGGararyCanvas from "../components/CGGararyCanvas";
import AnimatedTitle from "../components/AnimatedTitle";

const GalleryPage = () => {
  return (
    <div className="fixed inset-0 overflow-auto bg-black">
      <div className="fixed inset-0 w-screen h-screen">
        <CGGararyCanvas />
      </div>

      <div className="relative z-10 min-h-[100vh] flex flex-col items-center justify-center w-full py-12">
        <div className="h-24" /> {/* スペーサー */}
        <AnimatedTitle text="CGギャラリー" />

        <ul className="menu bg-base-200/30 backdrop-blur-sm rounded-box p-8 space-y-8 shadow-lg text-lg w-[400px]">
          <li>
            <Link to="/gallery/canvas1_1" className="flex items-center gap-6 hover:bg-white/20">
              <img
                src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746669111/imageelf_xelu3c.png"
                alt="エルフ"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <span className="text-white">🟠 エルフモデル</span>
            </Link>
          </li>

          <li>
            <Link to="/gallery/canvas2" className="flex items-center gap-6 hover:bg-white/20">
              <img
                src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746715619/BoxGold_szzfqk.png"
                alt="立方体"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <span className="text-white">🟢 立方体回転</span>
            </Link>
          </li>

          <li>
            <Link to="/gallery/canvas3_1" className="flex items-center gap-6 hover:bg-white/20">
              <img
                src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1747578900/Glico_wiy380.png"
                alt="星空"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <span className="text-white">🔵 パノラマ（R3F安定版）</span>
            </Link>
          </li>

          <li>
            <Link to="/gallery/canvas3" className="flex items-center gap-6 hover:bg-white/20">
              <img
                src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1747578900/Glico_wiy380.png"
                alt="星空"
                className="w-24 h-24 rounded-lg object-cover"
              />
              <span className="text-white">🔵 パノラマ（Three.js直書き）</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GalleryPage;
