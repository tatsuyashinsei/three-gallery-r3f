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
    if (!scene) {
      console.warn("🔴 Model3: Scene is not loaded");
      return;
    }

    console.log("🔄 Model3: モデルロード完了");

    // Clone the scene to avoid sharing materials
    const clonedScene = scene.clone(true);
    
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Ensure material is cloned
        if (child.material) {
          child.material = child.material.clone();
          child.material.needsUpdate = true;
        }

        // Set up Cone/Star material
        if (child.name === "Cone_Color_0" || child.name.includes("Star")) {
          console.log("🎯 Model3: Found target mesh:", child.name);
          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveIntensity = 20;
        }
      }
    });

    // Add cloned scene to group
    if (groupRef.current) {
      // Remove any existing children
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clonedScene);
    }

    // Set up model reference
    if (modelRef) {
      modelRef.current = groupRef.current;
      console.log("📦 Model3: modelRef.current updated:", {
        hasRef: !!modelRef.current,
        childCount: modelRef.current?.children?.length || 0
      });
    }
  }, [scene, modelRef]);

  return (
    <group
      ref={groupRef}
      visible={visible}
      position={[-140, -2, -38.9]}
      rotation={[0, Math.PI / 2.35, 0]}
      scale={5}
    >
      {/* Scene will be added via useEffect */}
    </group>
  );
}
