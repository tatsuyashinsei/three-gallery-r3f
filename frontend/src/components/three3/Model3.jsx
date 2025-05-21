// src/components/three3/Model3.jsx

import { useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

// ✅ forwardRef を通すことで外部から参照可能に
const Model3 = forwardRef((props, ref) => {
  const { scene } = useGLTF(
    "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb"
  );

  useEffect(() => {
    scene.traverse((c) => {
      c.castShadow = true;
      c.receiveShadow = true;
    });

    scene.position.set(-140, -2, -38.9);
    scene.rotation.y = Math.PI / 2.35;
    scene.scale.setScalar(5);
  }, [scene]);

  return <primitive object={scene} ref={ref} />;
});

export default Model3;
