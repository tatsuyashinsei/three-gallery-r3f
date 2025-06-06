// src/components/three3/ModelPanel3.jsx

import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ModelPanel3({ modelRef }) {
  const materialRefs = useRef([]);

  const controls = useControls("モデル設定", {
    "⭐ おすすめ設定": {
      value: "目の粗さ：0.1  金属性：1.0",
      editable: false,
    },
    rotationY: { value: Math.PI / 2.35, min: 0, max: Math.PI * 2, step: 0.01, label: "横回転" },
    emissiveIntensity: { value: 7, min: 0, max: 15, label: "発光強度" },
    roughness: { value: 0.1, min: 0, max: 1, label: "目の粗さ" },
    metalness: { value: 0.7, min: 0, max: 1, label: "金属性" },
    envMapIntensity: { value: 2.5, min: 0, max: 5, label: "環境強度" },
    clearcoat: { value: 0.8, min: 0, max: 1, label: "クリアコート" },
    iridescence: { value: 0.0, min: 0, max: 1, label: "玉虫色" },
    transmission: { value: 0.0, min: 0, max: 1, label: "透過率" },
    thickness: { value: 1.0, min: 0, max: 10, label: "厚み" },
    ior: { value: 1.5, min: 1, max: 2.5, label: "屈折率" },
    opacity: { value: 1.0, min: 0, max: 1, label: "不透明度" },
  });

  useEffect(() => {
    let retries = 0;
    const maxRetries = 20;

    function trySetup() {
      const current = modelRef?.current;
      if (!current || typeof current.traverse !== "function") {
        console.warn(
          `🔴 modelRef.current is not ready (retrying... ${retries})`
        );
        if (retries < maxRetries) {
          retries++;
          setTimeout(trySetup, 300);
        }
        return;
      }

      // Y軸回転の初期設定
      current.rotation.y = controls.rotationY;

      const collected = [];
      current.traverse((child) => {
        if (child.isMesh && child.material) {
          // マテリアルが配列のとき（multiMaterial）も対応
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.emissive = mat.emissive ?? { r: 1, g: 1, b: 1 };
            mat.emissiveIntensity = 0;
            mat.needsUpdate = true;
            collected.push(mat);
          });
        }
      });

      materialRefs.current = collected;
      console.log("✅ マテリアル対象数:", collected.length);
    }

    trySetup();
  }, [modelRef, controls.rotationY]);

  // Y軸回転の更新
  useEffect(() => {
    if (modelRef?.current) {
      modelRef.current.rotation.y = controls.rotationY;
    }
  }, [modelRef, controls.rotationY]);

  // フレーム毎に emissiveIntensity をイーズインで更新
  useFrame(() => {
    materialRefs.current.forEach((mat) => {
      const delta = controls.emissiveIntensity - mat.emissiveIntensity;
      if (Math.abs(delta) > 0.01) {
        mat.emissiveIntensity += delta * 0.2;
        mat.needsUpdate = true;
      }
    });
  });

  // 他のパラメータは即時反映
  useEffect(() => {
    materialRefs.current.forEach((mat) => {
      mat.roughness = controls.roughness;
      mat.metalness = controls.metalness;
      mat.envMapIntensity = controls.envMapIntensity;
      mat.clearcoat = controls.clearcoat;
      mat.iridescence = controls.iridescence;
      mat.transmission = controls.transmission;
      mat.thickness = controls.thickness;
      mat.ior = controls.ior;
      mat.opacity = controls.opacity;
      mat.transparent = controls.opacity < 1;
      mat.needsUpdate = true;
    });
  }, [controls]);

  return null;
}
