import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import BeamEffect from "./BeamEffect";

export default function SceneContent3({ onSceneReady, modelRef }) {
  const { scene } = useThree();

  const { endX, endZ } = useControls("Beam End (共通)", {
    endX: { value: 5, min: -20, max: 20, step: 0.1 },
    endZ: { value: 0, min: -5, max: 5, step: 0.1 },
  });

  const [startGreen, setStartGreen] = useState(new THREE.Vector3());
  const [endGreen, setEndGreen] = useState(new THREE.Vector3());
  const [startOrange, setStartOrange] = useState(new THREE.Vector3());
  const [endOrange, setEndOrange] = useState(new THREE.Vector3());

  useFrame(() => {
    if (!modelRef?.current) return;

    const pos = modelRef.current.position.clone();
    const yOffset = -0.05;

    const base = pos.clone().add(new THREE.Vector3(0, yOffset, 0));
    const end = pos.clone().add(new THREE.Vector3(endX * 2.0, yOffset, endZ));

    setStartGreen(base.clone());
    setEndGreen(end.clone());
    setStartOrange(base.clone());
    setEndOrange(end.clone());

    // 💡 デバッグ用
    // console.log("[SceneContent3] Green Start:", base.toArray())
    // console.log("[SceneContent3] Green End:", end.toArray())
  });

  useEffect(() => {
    if (onSceneReady && scene) {
      console.log("[SceneContent3] ✅ シーンが準備完了");
      onSceneReady(scene);
    }
  }, [onSceneReady, scene]);

  useEffect(() => {
    console.log(
      "[SceneContent3] 🧪 強制ビーム表示モード：green & orange を出力"
    );
  }, []);

  return (
    <>
      <OrbitControls enableDamping makeDefault />

      <BeamEffect
        type="green"
        alpha={2.0}
        start={startGreen}
        end={endGreen}
        visible={true}
      />
      <BeamEffect
        type="orange"
        alpha={2.0}
        start={startOrange}
        end={endOrange}
        visible={true}
      />
    </>
  );
}
