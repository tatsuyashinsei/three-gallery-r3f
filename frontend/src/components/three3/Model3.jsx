// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb";

export default function Model3({ visible = true, modelRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  useEffect(() => {
    console.log("🔄 モデルロード完了:", MODEL_URL);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // ⭐ 各マテリアルを clone（オリジナル破壊しないように）
        child.material = child.material.clone();
        child.material.needsUpdate = true;

        // Bloom など適用が必要なら以下も調整
        if (child.name === "Cone_Color_0") {
          console.log("🎯 Cone_Color_0 検出、emissive 設定");
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 20;
        }
      }
    });

    // ✅ モデル全体を渡す（cone だけでなく group 全体）
    if (modelRef) {
      modelRef.current = groupRef.current;
      console.log("📦 modelRef.current に group を設定:", groupRef.current);
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
