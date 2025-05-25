// CanvasRoot3.jsx

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";
import PostProcessing3 from "./PostProcessing3";
import BeamEffect from "./BeamEffect";

// 🔧 exposure のアニメーション管理
function ToneMappingController() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.0;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    console.log("🟢 ToneMapping 初期化完了");
  }, [gl]);

  useFrame(() => {
    if (gl.toneMappingExposure < 0.5) {
      gl.toneMappingExposure += 0.00028;
    }
  });

  return null;
}

// ✅ Cone の位置を取得して state に反映する Tracker
function BeamOriginTracker({ modelRef, setBeamPosition }) {
  useFrame(() => {
    const cone = modelRef.current?.cone;
    if (cone) {
      const pos = new THREE.Vector3();
      cone.getWorldPosition(pos);
      setBeamPosition(pos); // 状態を更新
    }
  });
  return null;
}

export default function CanvasRoot3() {
  const [beamVisible, setBeamVisible] = useState(false);
  const [beamPosition, setBeamPosition] = useState(new THREE.Vector3());
  const modelRef = useRef(null);
  const manualOffset = new THREE.Vector3(-137, 6, -38.5); // ⭐️ ビームの位置を調整

  const createBeam = () => {
    console.log("⚡️ createBeam 呼び出し");
    setBeamVisible(true);
  };

  // ✅ end を beamPosition から右に伸ばす
  const beamEnd = beamPosition.clone().add(new THREE.Vector3(1, 0, 0));

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [-180, 5, -50], fov: 75 }}
      style={{ width: "100%", height: "100vh", background: "black" }}
    >
      <ToneMappingController />
      <SceneContent3 modelRef={modelRef} />
      <PostProcessing3 />

      <BeamOriginTracker
        modelRef={modelRef}
        setBeamPosition={setBeamPosition}
      />

      {beamVisible && (
        <group
          position={beamPosition.clone().add(manualOffset)}
          scale={[80, 80, 80]}
        >
          <BeamEffect
            type="green"
            start={beamPosition}
            end={beamEnd}
            visible={true}
          />
        </group>
      )}

      <GuiPanelRoot
        createBeam={createBeam}
        beamVisible={beamVisible}
        setBeamVisible={setBeamVisible}
        modelRef={modelRef}
      />
    </Canvas>
  );
}
