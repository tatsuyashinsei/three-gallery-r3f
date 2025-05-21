// pages/GalleryCanvas1.jsx

import { useGLTF, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

const Model = () => {
  const gltf = useGLTF(
    "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/elf.glb"
  );
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const [pickables, setPickables] = useState([]);

  useEffect(() => {
    const meshes = [];
    gltf.scene.traverse((child) => {
      if (child.isMesh) meshes.push(child);
    });
    setPickables(meshes);
  }, [gltf]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(pickables, false);
      if (intersects.length) {
        console.log("🎯 Intersect!", intersects[0]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera, gl, pickables]);

  <mesh position={[0, 0, 0]}>
    <boxGeometry />
    <meshStandardMaterial color="orange" />
    <Html distanceFactor={10}>
      <div className="bg-white text-black px-2 py-1 rounded">
        📦 ボックスです！
      </div>
    </Html>
  </mesh>;


  return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />;
};

export default Model;
