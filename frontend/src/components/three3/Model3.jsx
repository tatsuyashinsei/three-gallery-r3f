// src/components/three3/Model3.jsx

import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MODEL_URL =
  "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb";

export default function Model3({ visible = true, modelRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // 🌟 "Cone_Color_0" だけマテリアル強調
        if (child.name === "Cone_Color_0") {
          const mat = child.material;
          mat.envMapIntensity = 2.5;
          mat.clearcoat = 0.8;
          mat.roughness = 0.1;
          mat.metalness = 0.7;
          mat.emissive = new THREE.Color(0xffffff);
          mat.emissiveIntensity = 0.3;
          mat.needsUpdate = true;
        }
      }
    });

    if (modelRef) modelRef.current = groupRef.current;
  }, [scene, modelRef]);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={[5, 5, 5]}
    >
      <primitive object={scene} />
    </group>
  );
}
