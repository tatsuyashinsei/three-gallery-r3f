// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb";

export default function Model3({ visible = true, modelRef }) {
  // ① useGLTF() の戻り値は毎回 clone して使う
  const { scene: src } = useGLTF(MODEL_URL);
  const model = useMemo(() => {
    if (!src) return null;
    console.log("📦 [Model3] Creating clone(true) - complete instance separation");
    const clone = src.clone(true); // インスタンス完全分離
    
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Ensure material is cloned
        if (child.material) {
          child.material = child.material.clone();
          child.material.needsUpdate = true;
        }

        // Set up Cone/Star material
        if (child.name === "Cone_Color_0" || child.name.includes("Star")) {
          console.log("🎯 Model3: Found target mesh:", child.name);
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 20;
        }
      }
    });

    return clone;
  }, [src]);

  const groupRef = useRef();

  // ② add 前に "二重マウントガード"
  const once = useRef(false);
  useEffect(() => {
    if (once.current) return; // 2回目を無視
    once.current = true;

    if (!model || !groupRef.current) return;

    console.count('addMascot'); // 確認ポイント: ページリロードごとに1だけ増える
    console.log("✅ [Model3] Adding model to group (once only)");

    groupRef.current.add(model);

    // Set up model reference
    if (modelRef) {
      modelRef.current = groupRef.current;
      console.log("📦 Model3: modelRef.current updated:", {
        hasRef: !!modelRef.current,
        childCount: modelRef.current?.children?.length || 0
      });
    }

    // ③ dispose は "共有されていない" と確認後に実行
    return () => {
      console.log("🧹 [Model3] Cleanup - remove only, safe dispose");
      if (groupRef.current && model) {
        groupRef.current.remove(model);
        
        // 安全な dispose: parent === null を確認してから
        if (model.parent === null) {
          model.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => mat.dispose());
                } else {
                  child.material.dispose();
                }
              }
            }
          });
        }
      }
      if (modelRef) {
        modelRef.current = null;
      }
    };
  }, [model, modelRef]);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={5}
    >
      {/* Scene will be added via useEffect */}
    </group>
  );
}

// drei のプリロード
useGLTF.preload(MODEL_URL);
