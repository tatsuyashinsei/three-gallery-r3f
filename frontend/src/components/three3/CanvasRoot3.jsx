// CanvasRoot3.jsx

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";
import * as THREE from "three";

function ToneMappingController() {
  const { gl } = useThree();

  // 初期トーンマッピング設定
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.0;

    // 💡 出力エンコーディング（暗すぎ防止）
    gl.outputEncoding = THREE.sRGBEncoding;

    console.log("🟢 ToneMapping 初期化: ACES + exposure = 0");
  }, [gl]);

  // exposure を徐々に上昇させる
  useFrame(() => {
    if (gl.toneMappingExposure < 0.5) {
      gl.toneMappingExposure += 0.00028;
      console.log("🌞 exposure:", gl.toneMappingExposure.toFixed(4));
    }
  });

  return null;
}

export default function CanvasRoot3() {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [-180, 5, -50], fov: 75 }}
      style={{ width: "100%", height: "100vh", background: "black" }}
    >
      {/* トーンマッピング制御 */}
      <ToneMappingController />

      {/* シーンの描画要素 */}
      <SceneContent3 />

      {/* GUIパネルと制御系 */}
      <GuiPanelRoot />
    </Canvas>
  );
}
