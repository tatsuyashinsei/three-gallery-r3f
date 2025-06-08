// src/components/three3/ModelPanel3.jsx

import { useControls, folder } from "leva";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 初期値を定数として定義
const INITIAL_VALUES = {
  rotationY: 1.34,        // 横回転
  emissiveIntensity: 17.8, // 発光強度
  roughness: 0.36,        // 目の粗さ
  metalness: 0.08,        // 金属性
  envMapIntensity: 3.30,  // 環境強度
  clearcoat: 0.00,        // クリアコート
  iridescence: 0.13,      // 玉虫色
  transmission: 0.44,     // 透過率
  thickness: 1.0,         // 厚み
  ior: 1.31,              // 屈折率
  opacity: 1.00,          // 不透明度
};

const ModelPanel3 = forwardRef(({ modelRef, onEmissiveIntensityChange, cometControls, handleCometControlsChange }, ref) => {
  const materialRefs = useRef([]);

  const [controls, set] = useControls(() => ({
    "モデル設定": folder({
      "⭐ おすすめ設定": {
        value: "目の粗さ：0.1  金属性：1.0",
        editable: false,
      },
      rotationY: { value: INITIAL_VALUES.rotationY, min: 0, max: Math.PI * 2, step: 0.01, label: "横回転" },
      emissiveIntensity: { 
        value: INITIAL_VALUES.emissiveIntensity, 
        min: 0, 
        max: 30, 
        label: "発光強度",
        onChange: (value) => {
          // 発光強度が変更されたときに親コンポーネントに通知
          if (onEmissiveIntensityChange) {
            onEmissiveIntensityChange(value);
          }
        }
      },
      roughness: { value: INITIAL_VALUES.roughness, min: 0, max: 1, label: "目の粗さ" },
      metalness: { value: INITIAL_VALUES.metalness, min: 0, max: 1, label: "金属性" },
      envMapIntensity: { value: INITIAL_VALUES.envMapIntensity, min: 0, max: 5, label: "環境強度" },
      clearcoat: { value: INITIAL_VALUES.clearcoat, min: 0, max: 1, label: "クリアコート" },
      iridescence: { value: INITIAL_VALUES.iridescence, min: 0, max: 1, label: "玉虫色" },
      transmission: { value: INITIAL_VALUES.transmission, min: 0, max: 1, label: "透過率" },
      thickness: { value: INITIAL_VALUES.thickness, min: 0, max: 10, label: "厚み" },
      ior: { value: INITIAL_VALUES.ior, min: 1, max: 2.5, label: "屈折率" },
      opacity: { value: INITIAL_VALUES.opacity, min: 0, max: 1, label: "不透明度" },
      
      // Comet Controls セクション
      "🌟 Comet Controls": folder({
        emission: {
          value: cometControls?.emission || 17.8,
          min: 0,
          max: 30,
          step: 0.1,
          label: "Emission",
          onChange: (value) => {
            if (handleCometControlsChange) {
              handleCometControlsChange({ emission: value });
            }
            // 発光強度も同時に更新
            if (onEmissiveIntensityChange) {
              onEmissiveIntensityChange(value);
            }
          }
        },
        "緑帯コントロール": folder({
          greenRotationX: {
            value: cometControls?.greenRotationX || 105,
            min: -360,
            max: 360,
            step: 1,
            label: "X回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ greenRotationX: value });
              }
            }
          },
          greenRotationY: {
            value: cometControls?.greenRotationY || -180,
            min: -360,
            max: 360,
            step: 1,
            label: "Y回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ greenRotationY: value });
              }
            }
          },
          greenRotationZ: {
            value: cometControls?.greenRotationZ || 103,
            min: -360,
            max: 360,
            step: 1,
            label: "Z回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ greenRotationZ: value });
              }
            }
          },
        }, { collapsed: true }),
        
        "黄帯コントロール": folder({
          orangeRotationX: {
            value: cometControls?.orangeRotationX || -105,
            min: -360,
            max: 360,
            step: 1,
            label: "X回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ orangeRotationX: value });
              }
            }
          },
          orangeRotationY: {
            value: cometControls?.orangeRotationY || -172,
            min: -360,
            max: 360,
            step: 1,
            label: "Y回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ orangeRotationY: value });
              }
            }
          },
          orangeRotationZ: {
            value: cometControls?.orangeRotationZ || -70,
            min: -360,
            max: 360,
            step: 1,
            label: "Z回転",
            onChange: (value) => {
              if (handleCometControlsChange) {
                handleCometControlsChange({ orangeRotationZ: value });
              }
            }
          },
        }, { collapsed: true }),
      }, { collapsed: true }),
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
      console.log("🔍 モデル構造のデバッグ開始");
      current.traverse((child) => {
        if (child.isMesh && child.material) {
          // 星のメッシュのみを対象にする（Cone_Color_0とStarを含むメッシュ）
          if (child.name === "Cone_Color_0" || child.name.includes("Star")) {
            console.log("🌟 発光対象メッシュを発見:", child.name, {
              type: child.material.type,
              beforeEmissive: child.material.emissive,
              beforeIntensity: child.material.emissiveIntensity
            });
            
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];
            
            materials.forEach((mat, index) => {
              // マテリアルの設定
              const targetMat = mat;
              
              // 発光設定を適用（確実に値を設定）
              targetMat.emissive = new THREE.Color(0xffffff);
              targetMat.emissiveIntensity = Number(controls.emissiveIntensity) || 7;
              targetMat.roughness = Number(controls.roughness) || 0.4;
              targetMat.metalness = Number(controls.metalness) || 0.6;
              
              // 発光を確実にするための追加設定
              targetMat.toneMapped = false;  // トーンマッピングを無効化
              targetMat.needsUpdate = true;
              
              collected.push(targetMat);
              
              console.log("✅ 発光設定完了:", {
                name: child.name,
                materialIndex: index,
                emissiveIntensity: targetMat.emissiveIntensity,
                roughness: targetMat.roughness,
                metalness: targetMat.metalness,
                toneMapped: targetMat.toneMapped
              });
            });
          }
        }
      });

      materialRefs.current = collected;
      console.log("✅ 発光マテリアル対象数:", collected.length);
    }

    trySetup();
  }, [modelRef, controls.rotationY, controls.emissiveIntensity, controls.roughness, controls.metalness]);

  // フレーム毎の更新（発光強度の確実な適用）
  useFrame(() => {
    materialRefs.current.forEach((mat) => {
      const targetIntensity = Number(controls.emissiveIntensity) || 7;
      if (mat.emissiveIntensity !== targetIntensity) {
        mat.emissiveIntensity = targetIntensity;
        mat.needsUpdate = true;
        console.log("🔄 発光強度更新:", {
          current: mat.emissiveIntensity,
          target: targetIntensity
        });
      }
    });
  });

  // 他のマテリアル設定の更新
  useEffect(() => {
    if (!modelRef?.current) return;
    
    modelRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        
        materials.forEach((mat) => {
          // 星以外のマテリアルのみ更新
          if (child.name !== "Cone_Color_0" && !child.name.includes("Star")) {
            Object.assign(mat, {
              roughness: controls.roughness,
              metalness: controls.metalness,
              envMapIntensity: controls.envMapIntensity,
              clearcoat: controls.clearcoat,
              iridescence: controls.iridescence,
              transmission: controls.transmission,
              thickness: controls.thickness,
              ior: controls.ior,
              opacity: controls.opacity,
              transparent: controls.opacity < 1,
              needsUpdate: true
            });
          }
        });
      }
    });
  }, [modelRef, controls.roughness, controls.metalness, controls.envMapIntensity, 
      controls.clearcoat, controls.iridescence, controls.transmission, 
      controls.thickness, controls.ior, controls.opacity]);

  return null;
});

ModelPanel3.displayName = 'ModelPanel3';

export default ModelPanel3;
