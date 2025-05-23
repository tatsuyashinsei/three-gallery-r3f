// Env3Controllers/FloorTextureController.jsx
import { useEffect } from "react";

export default function FloorTextureController({
  floor1,
  floor2,
  texture1,
  texture2,
  floor1TextureVisible,
  floor2TextureVisible,
}) {
  useEffect(() => {
    const mesh1 = floor1?.current;
    const mesh2 = floor2?.current;

    if (mesh1?.material) {
      mesh1.material.map = floor1TextureVisible ? texture1 : null;
      mesh1.material.needsUpdate = true;
    }

    if (mesh2?.material) {
      mesh2.material.map = floor2TextureVisible ? texture2 : null;
      mesh2.material.needsUpdate = true;
    }
  }, [
    floor1,
    floor2,
    texture1,
    texture2,
    floor1TextureVisible,
    floor2TextureVisible,
  ]);

  return null;
}
