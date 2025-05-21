// src/components/LoaderOverlay.jsx
import PropTypes from "prop-types";

const LoaderOverlay = ({ progress = 0 }) => (
  <div
    className="absolute inset-0 flex flex-col items-center justify-center
                  bg-black/90 text-white z-50 backdrop-blur"
  >
    <img
      src="https://cdn.jsdelivr.net/gh/threejsconf/pngs@main/Untitled174_20250514223416.png" // ← public フォルダ内の画像ならこの書き方でOK
      alt="ローディングロゴ"
      className="w-96 h-96 mb-6 animate-bounce" // Tailwind で大きさとアニメ指定
    />
    <p className="text-lg mb-2">読み込み中… {progress}%</p>
    <div className="w-64 h-4 bg-gray-700 rounded">
      <div
        className="bg-orange-400 h-full rounded"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

LoaderOverlay.propTypes = { progress: PropTypes.number };

export default LoaderOverlay;
