// src/store/useBeamStore.js
import { create } from "zustand";

export const useBeamStore = create((set) => ({
  beamVisible: true,
  toggleBeam: () => set((state) => ({ beamVisible: !state.beamVisible })),
  setBeamVisible: (val) => set({ beamVisible: val }),
}));
