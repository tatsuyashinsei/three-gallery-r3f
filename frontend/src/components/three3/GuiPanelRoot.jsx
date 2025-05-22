// src/components/three3/GuiPanelRoot.jsx

import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

import Model3 from "./Model3";
import Floor3 from "./Floor3";
import GuiPanel3 from "./GuiPanel3";
import { loadJPGEnvironment } from "@/lib/loadJPGEnvironment";

export default function GuiPanelRoot({ createBeam }) {
  const [environmentTexture, setEnvTexture] = useState(null);
  const [modelVisible, setModelVisible] = useState(true);
  const [floorVisible, setFloorVisible] = useState(true);

  const floor1 = useRef();
  const floor2 = useRef();
  const modelRef = useRef();
  const testLight = useRef(); // 将来使う予定なら残す

  const texture1 = useMemo(
    () => new THREE.TextureLoader().load("/tex1.jpg"),
    []
  );
  const texture2 = useMemo(
    () => new THREE.TextureLoader().load("/tex2.jpg"),
    []
  );

  const handleLoadJPG = async (url) => {
    try {
      const texture = await loadJPGEnvironment(url);
      setEnvTexture(texture);
    } catch (err) {
      console.error("環境マップの読み込み失敗:", err);
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        <Model3 visible={modelVisible} modelRef={modelRef} />
        <Floor3 visible={floorVisible} floor1Ref={floor1} floor2Ref={floor2} />
      </Suspense>

      <GuiPanel3
        floor1={floor1.current}
        floor2={floor2.current}
        texture1={texture1}
        texture2={texture2}
        environmentTexture={environmentTexture}
        modelRef={modelRef}
        createBeam={createBeam}
        loadHDR={handleLoadJPG}
        testLight={testLight.current}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        floorVisible={floorVisible}
        setFloorVisible={setFloorVisible}
      />
    </>
  );
}
