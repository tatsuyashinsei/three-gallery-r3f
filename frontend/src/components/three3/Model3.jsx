// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Model3({ visible = true, modelRef }) {
  const { scene } = useGLTF(
    "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb"
  );

  useEffect(() => {
    scene.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // 外部参照用に登録
    if (modelRef?.current) {
      modelRef.current = scene;
    }
  }, [scene, modelRef]);

  if (!visible) return null; // ✅ オンオフ切り替えに対応

  return (
    <primitive
      object={scene}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={5}
    />
  );
}
