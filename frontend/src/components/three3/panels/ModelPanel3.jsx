// src/components/three3/ModelPanel3.jsx

import { useControls, folder } from "leva";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";

// 初期値を定数として定義
const INITIAL_VALUES = {
  rotationY: Math.PI / 2.35,
  emissiveIntensity: 7,
  roughness: 0.1,
  metalness: 0.7,
  envMapIntensity: 2.5,
  clearcoat: 0.8,
  iridescence: 0.0,
  transmission: 0.0,
  thickness: 1.0,
  ior: 1.5,
  opacity: 1.0,
};

const ModelPanel3 = forwardRef(({ modelRef }, ref) => {
  const materialRefs = useRef([]);

  const [controls, set] = useControls(() => ({
    "モデル設定": folder({
      "⭐ おすすめ設定": {
        value: "目の粗さ：0.1  金属性：1.0",
        editable: false,
      },
      rotationY: { value: INITIAL_VALUES.rotationY, min: 0, max: Math.PI * 2, step: 0.01, label: "横回転" },
      emissiveIntensity: { value: INITIAL_VALUES.emissiveIntensity, min: 0, max: 15, label: "発光強度" },
      roughness: { value: INITIAL_VALUES.roughness, min: 0, max: 1, label: "目の粗さ" },
      metalness: { value: INITIAL_VALUES.metalness, min: 0, max: 1, label: "金属性" },
      envMapIntensity: { value: INITIAL_VALUES.envMapIntensity, min: 0, max: 5, label: "環境強度" },
      clearcoat: { value: INITIAL_VALUES.clearcoat, min: 0, max: 1, label: "クリアコート" },
      iridescence: { value: INITIAL_VALUES.iridescence, min: 0, max: 1, label: "玉虫色" },
      transmission: { value: INITIAL_VALUES.transmission, min: 0, max: 1, label: "透過率" },
      thickness: { value: INITIAL_VALUES.thickness, min: 0, max: 10, label: "厚み" },
      ior: { value: INITIAL_VALUES.ior, min: 1, max: 2.5, label: "屈折率" },
      opacity: { value: INITIAL_VALUES.opacity, min: 0, max: 1, label: "不透明度" },
    }, { collapsed: true })
  }));

  // リセット機能を公開
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log("🔄 [ModelPanel3] リセット実行");
      
      // 各パラメータを初期値にリセット
      set({
        rotationY: INITIAL_VALUES.rotationY,
        emissiveIntensity: INITIAL_VALUES.emissiveIntensity,
        roughness: INITIAL_VALUES.roughness,
        metalness: INITIAL_VALUES.metalness,
        envMapIntensity: INITIAL_VALUES.envMapIntensity,
        clearcoat: INITIAL_VALUES.clearcoat,
        iridescence: INITIAL_VALUES.iridescence,
        transmission: INITIAL_VALUES.transmission,
        thickness: INITIAL_VALUES.thickness,
        ior: INITIAL_VALUES.ior,
        opacity: INITIAL_VALUES.opacity,
      });
      
      console.log("✅ [ModelPanel3] モデル設定リセット完了");
    }
  }));

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
});

ModelPanel3.displayName = 'ModelPanel3';

export default ModelPanel3;
