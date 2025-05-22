// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb";

export default function Model3({ visible = true, modelRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  useEffect(() => {
    // モデル内の影設定
    scene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // 外部からアクセスできるように ref に登録
    if (modelRef?.current !== undefined) {
      modelRef.current = groupRef.current;
    }
  }, [scene, modelRef]);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={[5, 5, 5]}
    >
      <primitive object={scene} />
    </group>
  );
}

