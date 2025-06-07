// src/components/three3/GuiPanelRoot.jsx

import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

import Floor3 from "./Floor3";
import GuiPanel3 from "./GuiPanel3";
import { loadJPGEnvironment } from "@/lib/loadJPGEnvironment";

export default function GuiPanelRoot({ 
  createBeam, 
  beamVisible, 
  setBeamVisible, 
  modelRef, 
  cameraControllerRef, 
  bloomRef, 
  onEmissiveIntensityChange,
  isLoading = false
}) {
  const [environmentTexture, setEnvTexture] = useState(null);

  // 表示制御
  const [modelVisible, setModelVisible] = useState(true);
  const [floorVisible, setFloorVisible] = useState(false);
  const [floor1TextureVisible, setFloor1TextureVisible] = useState(false);
  const [floor2TextureVisible, setFloor2TextureVisible] = useState(false);

  const testLight = useRef();
  const floor1Ref = useRef();
  const floor2Ref = useRef();

  // テクスチャの読み込み
  const texture1 = useMemo(() => {
    const tex = new THREE.TextureLoader().load(
      "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const texture2 = useMemo(() => {
    const tex = new THREE.TextureLoader().load(
      "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.x = -1;
    return tex;
  }, []);

  const handleLoadJPG = async (url) => {
    try {
      const texture = await loadJPGEnvironment(url);
      setEnvTexture(texture);
    } catch (err) {
      console.error("環境マップの読み込み失敗:", err);
    }
  };

  // モデルの表示状態を更新
  useEffect(() => {
    if (modelRef?.current) {
      modelRef.current.visible = modelVisible;
    }
  }, [modelRef, modelVisible]);

  return (
    <>
      <Suspense fallback={null}>
        <Floor3
          visible={floorVisible}
          textureVisible1={floor1TextureVisible}
          textureVisible2={floor2TextureVisible}
          ref={floor1Ref}
          position={[-133, -11, -36.65]}
          rotation={[0, -Math.PI / 1.69, 0]}
        />
      </Suspense>

      {/* ローディング中はGUIを非表示 */}
      {!isLoading && (
        <GuiPanel3
          floor1={floor1Ref}
          floor2={floor2Ref}
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
          beamVisible={beamVisible}
          setBeamVisible={setBeamVisible}
          cameraControllerRef={cameraControllerRef}
          bloomRef={bloomRef}
          onEmissiveIntensityChange={onEmissiveIntensityChange}
        />
      )}
    </>
  );
}
