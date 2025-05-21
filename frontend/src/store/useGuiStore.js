// src/store/useGuiStore.js
import { create } from "zustand";

const useGuiStore = create((set) => ({
  beamVisible: false,
  environment: true,
  planeVisible: false,
  toggleBeam: () => set((s) => ({ beamVisible: !s.beamVisible })),
  toggleEnv: () => set((s) => ({ environment: !s.environment })),
  togglePlane: () => set((s) => ({ planeVisible: !s.planeVisible })),
}));

export default useGuiStore;
