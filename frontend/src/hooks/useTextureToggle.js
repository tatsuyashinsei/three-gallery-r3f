// /hooks/useTextureToggle.jsx

import { useEffect } from "react";

export function useTextureToggle(ref, texture, isVisible) {
  useEffect(() => {
    const mesh = ref?.current;
    if (!mesh || !mesh.material) return;

    mesh.material.map = isVisible ? texture : null;
    mesh.material.needsUpdate = true;
  }, [ref, texture, isVisible]);
}
