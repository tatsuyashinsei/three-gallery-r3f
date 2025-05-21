// GuiPanelRoot.jsx

import { useRef, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import GuiPanel3 from "./GuiPanel3";
import OtherSceneParts from "./otherSceneParts";
import * as THREE from "three";

import { loadJPGEnvironment } from "@/lib/loadJPGEnvironment"; // ✅ JPG用に変更
import useGuiStore from "@/store/useGuiStore";

export default function GuiPanelRoot({ createBeam }) {
  const { scene, gl } = useThree();
  const { setLoadingHDR, setEnvironmentTexture } = useGuiStore();

  // ✅ ここで取得
  const environmentTexture = useGuiStore((s) => s.environmentTexture);

  const handleLoadJPG = async (url) => {
    try {
      setLoadingHDR(true);
      const texture = await loadJPGEnvironment(url);
      console.log("🟡 [handleLoadJPG] 取得したテクスチャ:", texture);

      // ✅ ここでストア更新
      setEnvironmentTexture(texture);
    } catch (error) {
      console.error("JPGの環境マップ読み込み失敗:", error);
    } finally {
      setLoadingHDR(false);
    }
  };

  const floor1 = useRef();
  const floor2 = useRef();
  const modelRef = useRef();
  // const particleSystem = useRef();
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
        // particleSystemRef={particleSystem}
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
        // particleSystem={particleSystem.current}
        modelRef={modelRef}
        greenBeam={greenBeam.current}
        orangeBeam={orangeBeam.current}
        createBeam={createBeam}
        loadHDR={handleLoadJPG} // ✅ ここも変更
        testLight={testLight.current}
      />
    </>
  );
}


