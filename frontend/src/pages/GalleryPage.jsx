// GalleryPage.jsx

import { Link } from "react-router-dom";
import CGGararyCanvas from "../components/CGGararyCanvas";

const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-900 text-black">
      <CGGararyCanvas />

      <h1 className="text-4xl font-bold mb-12 text-white">
        <br />
        CGギャラリー
      </h1>

      <ul className="menu bg-base-200 rounded-box p-8 space-y-8 shadow-lg text-lg w-[400px]">
        <li>
          <Link to="/gallery/canvas1_1" className="flex items-center gap-6">
            <img
              src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746669111/imageelf_xelu3c.png"
              alt="エルフ"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <span>🟠 エルフモデル</span>
          </Link>
        </li>

        <li>
          <Link to="/gallery/canvas2" className="flex items-center gap-6">
            <img
              src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746715619/BoxGold_szzfqk.png"
              alt="立方体"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <span>🟢 立方体回転</span>
          </Link>
        </li>

        <li>
          <Link to="/gallery/canvas4" className="flex items-center gap-6">
            <img
              src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1747578900/Glico_wiy380.png"
              alt="星空"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <span>🔵 パノラマ（安定版）</span>
          </Link>
        </li>

        <li>
          <Link to="/gallery/canvas3" className="flex items-center gap-6">
            <img
              src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1747578900/Glico_wiy380.png"
              alt="星空"
              className="w-24 h-24 rounded-lg object-cover"
            />
            <span>🔵 パノラマ（不安定版）</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default GalleryPage;
