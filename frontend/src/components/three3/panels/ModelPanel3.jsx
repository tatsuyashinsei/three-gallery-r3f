// panels/ModelPanel3.jsx

import { useControls } from "leva";
import { useEffect } from "react";
import * as THREE from "three"; // ← これが漏れていたかも

export default function ModelPanel3({ modelRef, testLight }) {
  const {
    roughness,
    metalness,
    envMapIntensity,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
    opacity,
    emissiveIntensity,
  } = useControls("モデル設定", {
    emissiveIntensity: { value: 0.5, min: 0, max: 5, label: "星の光量" },
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
    if (!modelRef?.current) return;

    modelRef.current.traverse((child) => {
      if (child.isMesh && child.name === "Cone_Color_0" && child.material) {
        const mat = child.material;

        mat.roughness = roughness;
        mat.metalness = metalness;
        mat.envMapIntensity = envMapIntensity;
        mat.clearcoat = clearcoat;
        mat.iridescence = iridescence;
        mat.transmission = transmission;
        mat.thickness = thickness;
        mat.ior = ior;
        mat.opacity = opacity;
        mat.transparent = opacity < 1;

        // ⭐ 発光プロパティ
        mat.emissive = new THREE.Color(0xffffff);
        mat.emissiveIntensity = emissiveIntensity;

        mat.needsUpdate = true;
      }
    });
  }, [
    modelRef,
    roughness,
    metalness,
    envMapIntensity,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
    opacity,
    emissiveIntensity,
  ]);

  return null;
}
