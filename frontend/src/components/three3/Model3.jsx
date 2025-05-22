// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";

export default function Model3({ visible = true, modelRef }) {
  const { scene } = useGLTF(
    "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb"
  );

  const groupRef = useRef();

  useEffect(() => {
    // モデル内の影設定
    scene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // 外部参照に group を渡す（groupRef経由）
    if (modelRef) modelRef.current = groupRef.current;
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
