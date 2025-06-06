// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb";

export default function Model3({ visible = true, modelRef, onLoad }) {
  const { scene: src } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  // モデルのクローンを作成
  const model = useMemo(() => {
    if (!src) return null;
    console.log("📦 [Model3] Creating clone(true) - complete instance separation");
    const clone = src.clone(true);
    
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();
          child.material.needsUpdate = true;
        }

        if (child.name === "Cone_Color_0" || child.name.includes("Star")) {
          console.log("🎯 Model3: Found target mesh:", child.name);
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 20;
        }
      }
    });

    return clone;
  }, [src]);

  // モデルの初期化と参照の設定
  useEffect(() => {
    if (!model || !groupRef.current) return;

    // groupRefにモデルを追加
    if (!groupRef.current.children.includes(model)) {
      console.log("✅ [Model3] Adding model to group");
      groupRef.current.add(model);
    }

    // modelRefの更新
    if (modelRef) {
      modelRef.current = groupRef.current;
      console.log("📦 [Model3] modelRef updated:", {
        hasRef: !!modelRef.current,
        childCount: modelRef.current?.children?.length || 0,
        position: modelRef.current?.position.toArray(),
        rotation: modelRef.current?.rotation.toArray()
      });
    }

    // onLoad コールバックの呼び出し
    if (onLoad) {
      onLoad(groupRef.current);
    }

    return () => {
      console.log("🧹 [Model3] Cleanup");
      if (groupRef.current && model) {
        groupRef.current.remove(model);
        
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
  }, [model, modelRef, onLoad]);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={5}
    />
  );
}

useGLTF.preload(MODEL_URL);
