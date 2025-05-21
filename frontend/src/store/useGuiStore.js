import { create } from "zustand";

const useGuiStore = create((set) => ({
  // 🌍 環境・表示設定
  environment: true,
  background: true,
  planeVisible: false,
  floor1TextureVisible: false,
  floor2TextureVisible: false,
  beamVisible: false,

  // 🎛 モデル設定
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

  // 🎨 マテリアル設定
  floorMat: {
    roughness: 1.0,
    metalness: 0.0,
    transmission: 0.0,
  },

  // ✅ トグル関数
  toggleEnv: () => set((s) => ({ environment: !s.environment })),
  toggleBackground: () => set((s) => ({ background: !s.background })),
  togglePlane: () => set((s) => ({ planeVisible: !s.planeVisible })),
  toggleBeam: () => set((s) => ({ beamVisible: !s.beamVisible })),

  // ✅ 個別値変更関数
  setModelValue: (key, value) =>
    set((s) => ({
      model: { ...s.model, [key]: value },
    })),
  setFloorMatValue: (key, value) =>
    set((s) => ({
      floorMat: { ...s.floorMat, [key]: value },
    })),

  // ✅ リセット関数
  resetAll: () =>
    set(() => ({
      environment: true,
      background: true,
      planeVisible: false,
      floor1TextureVisible: false,
      floor2TextureVisible: false,
      beamVisible: false,
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
