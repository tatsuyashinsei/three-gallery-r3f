import { create } from "zustand";
export const useModelStore = create((set) => ({
  modelRef: null,
  setModelRef: (r) => set({ modelRef: r }),
}));
