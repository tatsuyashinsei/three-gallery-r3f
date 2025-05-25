// src/components/three3/ModelPanel3.jsx

import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ModelPanel3({ modelRef }) {
  const materialRefs = useRef([]);

  const controls = useControls("モデル設定", {
    emissiveIntensity: { value: 7, min: 0, max: 15 },
    roughness: { value: 0.1, min: 0, max: 1 },
    metalness: { value: 0.7, min: 0, max: 1 },
    envMapIntensity: { value: 2.5, min: 0, max: 5 },
    clearcoat: { value: 0.8, min: 0, max: 1 },
    iridescence: { value: 0.0, min: 0, max: 1 },
    transmission: { value: 0.0, min: 0, max: 1 },
    thickness: { value: 1.0, min: 0, max: 10 },
    ior: { value: 1.5, min: 1, max: 2.5 },
    opacity: { value: 1.0, min: 0, max: 1 },
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
  }, [modelRef]);

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
