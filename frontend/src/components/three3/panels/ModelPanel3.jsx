import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ModelPanel3({ modelRef }) {
  const matRef = useRef(null);

  const {
    emissiveIntensity: targetEmissiveIntensity,
    roughness,
    metalness,
    envMapIntensity,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
    opacity,
  } = useControls("モデル設定", {
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

  // ⭐ 遅延で modelRef.current を待ってから初期化
  useEffect(() => {
    let retries = 0;
    const maxRetries = 20;

    function trySetup() {
      if (!modelRef?.current) {
        console.warn("🔴 modelRef.current is null (retrying...)", retries);
        if (retries < maxRetries) {
          retries++;
          setTimeout(trySetup, 300); // 0.3秒後に再試行
        }
        return;
      }

      let found = false;

      modelRef.current.traverse((child) => {
        if (child.isMesh && child.name === "Cone_Color_0" && child.material) {
          matRef.current = child.material;
          matRef.current.emissive = new THREE.Color(0xffff88);
          matRef.current.emissiveIntensity = 0;
          matRef.current.needsUpdate = true;
          found = true;
          console.log("✅ Cone_Color_0 マテリアル取得完了");
        }
      });

      if (!found) console.warn("⚠️ Cone_Color_0 が見つかりませんでした");
    }

    trySetup();
  }, [modelRef]);

  // 🌟 emissiveIntensity にイーズ適用
  useFrame(() => {
    const mat = matRef.current;
    if (!mat) return;

    const delta = targetEmissiveIntensity - mat.emissiveIntensity;
    if (Math.abs(delta) > 0.01) {
      mat.emissiveIntensity += delta * 0.2;
      mat.needsUpdate = true;
    }
  });

  // 他プロパティは即反映
  useEffect(() => {
    const mat = matRef.current;
    if (!mat) return;

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
    mat.needsUpdate = true;
  }, [
    roughness,
    metalness,
    envMapIntensity,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
    opacity,
  ]);

  return null;
}
