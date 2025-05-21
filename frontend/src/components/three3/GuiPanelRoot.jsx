// GuiPanelRoot.jsx

import { useRef, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import GuiPanel3 from "./GuiPanel3";
import OtherSceneParts from "./otherSceneParts";
import * as THREE from "three";

import { loadHDR } from "@/lib/loadHDR";
import useGuiStore from "@/store/useGuiStore"; // ✅ Zustandのストアをインポート

export default function GuiPanelRoot({ environmentTexture, createBeam }) {
  const { scene, gl } = useThree();
  const { setLoadingHDR } = useGuiStore(); // ✅ ZustandからSetterを取得

  const handleLoadHDR = async (url) => {
    try {
      setLoadingHDR(true); // 開始
      await loadHDR(url, scene, gl); // HDRロード
    } catch (error) {
      console.error("HDRの読み込みに失敗しました:", error);
    } finally {
      setLoadingHDR(false); // 終了
    }
  };

  const floor1 = useRef();
  const floor2 = useRef();
  const modelRef = useRef();
  const particleSystem = useRef();
  const dirLight = useRef();
  const ambientLight = useRef();
  const testLight = useRef();

  const greenBeam = useRef();
  const orangeBeam = useRef();

  const texture1 = useMemo(
    () => new THREE.TextureLoader().load("/tex1.jpg"),
    []
  );
  const texture2 = useMemo(
    () => new THREE.TextureLoader().load("/tex2.jpg"),
    []
  );

  return (
    <>
      <OtherSceneParts
        floor1Ref={floor1}
        floor2Ref={floor2}
        modelRef={modelRef}
        particleSystemRef={particleSystem}
        directionallightRef={dirLight}
        ambientLightRef={ambientLight}
        testLightRef={testLight}
      />

      <GuiPanel3
        floor1={floor1.current}
        floor2={floor2.current}
        texture1={texture1}
        texture2={texture2}
        environmentTexture={environmentTexture}
        yourLight={dirLight.current}
        yourAmbientLight={ambientLight.current}
        particleSystem={particleSystem.current}
        modelRef={modelRef}
        greenBeam={greenBeam.current}
        orangeBeam={orangeBeam.current}
        createBeam={createBeam}
        loadHDR={handleLoadHDR} // ✅ async/await + 状態管理付き
        testLight={testLight.current}
      />
    </>
  );
}

