import { Canvas, useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";
import PostProcessing3 from "./PostProcessing3";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

function ToneMappingController() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.0;

    // ✅ 非推奨の outputEncoding は使用せず、colorSpace を使う
    gl.outputColorSpace = THREE.SRGBColorSpace;

    console.log("🟢 ToneMapping 初期化: ACES + exposure = 0");
  }, [gl]);

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
      {/* トーンマッピングと描画処理 */}
      <ToneMappingController />

      {/* メインシーン */}
      <SceneContent3 />

      {/* 🌟 Bloomなどポストプロセス */}
      <PostProcessing3 />

      {/* UI コントロール */}
      <GuiPanelRoot />
    </Canvas>
  );
}
