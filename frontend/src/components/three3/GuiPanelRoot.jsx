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

  // 表示制御
  const [modelVisible, setModelVisible] = useState(true);
  const [floorVisible, setFloorVisible] = useState(true);
  const [floor1TextureVisible, setFloor1TextureVisible] = useState(false);
  const [floor2TextureVisible, setFloor2TextureVisible] = useState(false);

  const modelRef = useRef();
  const testLight = useRef();

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
        <Floor3
          visible={floorVisible}
          textureVisible1={floor1TextureVisible}
          textureVisible2={floor2TextureVisible}
        />
      </Suspense>

      <GuiPanel3
        floor1={null} // もう未使用
        floor2={null} // 同上
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
        floor1TextureVisible={floor1TextureVisible}
        setFloor1TextureVisible={setFloor1TextureVisible}
        floor2TextureVisible={floor2TextureVisible}
        setFloor2TextureVisible={setFloor2TextureVisible}
      />
    </>
  );
}
