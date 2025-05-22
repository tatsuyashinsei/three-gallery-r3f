// src/store/useGuiStore.js

import { create } from "zustand";

const useGuiStore = create((set) => ({
  // 🌍 環境・背景設定
  environment: true,
  background: true,
  environmentTexture: null,
  setEnvironmentTexture: (tex) => {
    console.log("🟢 [Zustand] setEnvironmentTexture 実行", tex);
    set({ environmentTexture: tex });
  },

  // 🌐 HDR読み込み状態
  isLoadingHDR: false,
  setLoadingHDR: (bool) => set({ isLoadingHDR: bool }),

  // 🎛 モデルマテリアル設定
  model: {
    scale: 5,
    posY: -2,
    rotationY: Math.PI / 2.35,
    emissiveIntensity: 20,
    roughness: 0.5,
    metalness: 0.5,
    transmission: 0.0,
    opacity: 1.0,
    clearcoat: 0.0,
    iridescence: 0.0,
    thickness: 1.0,
    ior: 1.5,
  },

  // 🎨 床マテリアル設定
  floorMat: {
    roughness: 1.0,
    metalness: 0.0,
    transmission: 0.0,
  },

  // ✅ トグル（環境と背景のみ残す）
  toggleEnv: () => set((s) => ({ environment: !s.environment })),
  toggleBackground: () => set((s) => ({ background: !s.background })),

  // ✅ 値変更関数
  setModelValue: (key, value) =>
    set((s) => ({
      model: { ...s.model, [key]: value },
    })),

  setFloorMatValue: (key, value) =>
    set((s) => ({
      floorMat: { ...s.floorMat, [key]: value },
    })),

  // ✅ フルリセット
  resetAll: () =>
    set(() => ({
      environment: true,
      background: true,
      environmentTexture: null,
      isLoadingHDR: false,
      model: {
        scale: 5,
        posY: -2,
        rotationY: Math.PI / 2.35,
        emissiveIntensity: 20,
        roughness: 0.5,
        metalness: 0.5,
        transmission: 0.0,
        opacity: 1.0,
        clearcoat: 0.0,
        iridescence: 0.0,
        thickness: 1.0,
        ior: 1.5,
      },
      floorMat: {
        roughness: 1.0,
        metalness: 0.0,
        transmission: 0.0,
      },
    })),
}));

export default useGuiStore;
