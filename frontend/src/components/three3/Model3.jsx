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
    console.log("🔄 モデルロード完了: IchibanboshiModeling5comp.glb");
    let found = false;

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // ⭐️ 特定メッシュの検出とマテリアル処理
        if (child.name === "Cone_Color_0") {
          found = true;
          console.log("🎯 'Cone_Color_0' 検出！マテリアルを clone");
          child.material = child.material.clone();
          child.material.needsUpdate = true;
          console.log("✅ clone後 material:", child.material);
        }
      }
    });

    if (!found) {
      console.warn("⚠️ 'Cone_Color_0' がモデル内に見つかりませんでした");
    }

    if (modelRef) {
      modelRef.current = groupRef.current;
      console.log(
        "📦 modelRef.current に groupRef 設定完了:",
        modelRef.current
      );
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
