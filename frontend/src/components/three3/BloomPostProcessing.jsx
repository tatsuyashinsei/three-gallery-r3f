import { forwardRef, useImperativeHandle, useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";

// 初期ブルーム設定
const INITIAL_BLOOM_VALUES = {
  intensity: 0.03,    // 0.01 → 0.03 少しだけ上げる
  radius: 0.35,       // 0.25 → 0.35 広がりを少し増やす
  threshold: 0.96,    // 0.98 → 0.96 閾値を少し下げる
};

const BloomPostProcessing = forwardRef(({ emissiveIntensity = 7 }, ref) => {
  const bloomRef = useRef();

  // ブルーム設定を公開（リセット用）
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log("🔄 [BloomPostProcessing] ブルームリセット実行");
    }
  }));

  // 発光強度に基づいてブルーム強度を調整
  useFrame(() => {
    if (bloomRef.current) {
      // 発光強度0でほぼ完全に効果なし、値を上げても非常に緩やかに上昇（0.03-0.12の範囲）
      const normalizedIntensity = Math.max(0, emissiveIntensity / 30);
      // 立方関数で非常に緩やかな上昇カーブを作成
      const mappedIntensity = 0.03 + (Math.pow(normalizedIntensity, 3) * 0.09);
      bloomRef.current.intensity = mappedIntensity;
      
      // 閾値も極めて緩やかに調整（0.96-0.90の範囲）
      const mappedThreshold = 0.96 - (Math.pow(normalizedIntensity, 2) * 0.06);
      bloomRef.current.threshold = mappedThreshold;
      
      console.log(`🌟 Bloom調整: intensity=${mappedIntensity.toFixed(4)}, threshold=${mappedThreshold.toFixed(3)}, emissiveIntensity=${emissiveIntensity}`);
    }
  });

  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
        intensity={INITIAL_BLOOM_VALUES.intensity}
        radius={INITIAL_BLOOM_VALUES.radius}
        threshold={INITIAL_BLOOM_VALUES.threshold}
        luminanceThreshold={0.98}  // 発光閾値を極限まで上げる
        luminanceSmoothing={0.05}  // スムージングを最小限に
      />
    </EffectComposer>
  );
});

BloomPostProcessing.displayName = 'BloomPostProcessing';

export default BloomPostProcessing; 