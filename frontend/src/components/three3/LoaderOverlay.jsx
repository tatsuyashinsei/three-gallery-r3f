// src/components/LoaderOverlay.jsx

// src/components/LoaderOverlay.jsx
import { Html, useProgress } from "@react-three/drei";

export default function LoaderOverlay() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-black/70 backdrop-blur-md text-white w-72">
        <div className="text-lg font-semibold">
          Loading... {Math.floor(progress)}%
        </div>

        {/* スピナー */}
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />

        {/* プログレスバー（おまけで残してもOK） */}
        <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}



