// src/components/LoaderOverlay.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const LoaderOverlay = ({ progress = 0, onLoadingComplete }) => {
  const [showLoader, setShowLoader] = useState(true);
  const [loadStartTime] = useState(Date.now());
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (progress >= 100 && !hasCompleted) {
      setHasCompleted(true);
      
      // 最低1秒間は表示を保証
      const elapsedTime = Date.now() - loadStartTime;
      const minDisplayTime = 1000; // 1秒
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      setTimeout(() => {
        setShowLoader(false);
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, remainingTime);
    }
  }, [progress, loadStartTime, hasCompleted, onLoadingComplete]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/95 text-white z-50 backdrop-blur-sm">
      {/* ロゴ */}
      <div className="mb-8 relative">
        {/* 背景の光るリング */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 animate-spin" 
             style={{ animationDuration: '3s' }}></div>
        
        {/* より大きな外側のリング */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-red-500/20 animate-ping"></div>
        
        {/* メインロゴ */}
        <div className="relative animate-bounce">
          <img
            src="https://cdn.jsdelivr.net/gh/threejsconf/pngs@main/Untitled174_20250514223416.png"
            alt="いちばん星ロゴ"
            className="w-72 h-72 object-contain transform hover:scale-110 transition-transform duration-300"
          />
          
          {/* ロゴの上にキラキラエフェクト */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${15 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* タイトル */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2 animate-pulse">
          いちばん星
        </h1>
        <p className="text-xl text-gray-300 text-center animate-fade-in">
          {hasCompleted ? (
            <span className="animate-bounce inline-block">準備完了...</span>
          ) : (
            <span className="animate-pulse">読み込み中...</span>
          )}
        </p>
      </div>

      {/* DaisyUI 進捗バー */}
      <div className="w-96 mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>進捗</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        
        {/* DaisyUI progress component */}
        <progress 
          className="progress progress-warning w-full h-3" 
          value={progress} 
          max="100"
        ></progress>
        
        {/* カスタムグラデーション進捗バー（フォールバック） */}
        <div className="w-full bg-gray-700 rounded-full h-3 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-full rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* 輝きエフェクト */}
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 追加情報 */}
      <div className="text-center text-gray-400 text-sm max-w-md">
        {progress < 30 && <p>3Dモデルを読み込んでいます...</p>}
        {progress >= 30 && progress < 60 && <p>テクスチャを準備しています...</p>}
        {progress >= 60 && progress < 90 && <p>エフェクトを初期化しています...</p>}
        {progress >= 90 && progress < 100 && <p>最終調整中...</p>}
        {progress >= 100 && <p>まもなく開始されます...</p>}
      </div>

      {/* ローディングスピナー */}
      <div className="mt-6 relative">
        {/* 背景の光るサークル */}
        <div className="absolute inset-0 w-16 h-16 bg-yellow-400/20 rounded-full animate-ping"></div>
        
        {/* メインスピナー */}
        <div className="relative animate-bounce" style={{ animationDelay: '0.5s' }}>
          <div className="loading loading-spinner loading-lg text-yellow-400"></div>
        </div>
        
        {/* 周りを回る小さな星 */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 60}deg) translate(30px) rotate(-${i * 60}deg)`,
                transformOrigin: '0 0'
              }}
            />
          ))}
        </div>
      </div>

      {/* 装飾的な星 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="star-field">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

LoaderOverlay.propTypes = { 
  progress: PropTypes.number,
  onLoadingComplete: PropTypes.func
};

export default LoaderOverlay;
