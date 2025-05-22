// src/components/three3/SceneContent3.jsx


import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function SceneContent3({ onSceneReady }) {
  const { scene } = useThree();

  useEffect(() => {
    if (onSceneReady && scene) {
      onSceneReady(scene);
    }
  }, [onSceneReady, scene]);

  return <OrbitControls enableDamping makeDefault />;
}

