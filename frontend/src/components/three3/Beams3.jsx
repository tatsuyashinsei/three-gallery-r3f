// Beams3.jsx

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import useGuiStore from "@/store/useGuiStore"; // ✅ 修正済み
import * as THREE from "three";

export default function Beams3({ position = [0, 0, 0] }) {
  const { scene } = useThree();
  const { beamVisible } = useGuiStore();
  const beams = useRef([]);

  useEffect(() => {
    if (!beamVisible) {
      beams.current.forEach((b) => scene.remove(b));
      beams.current = [];
      return;
    }

    beams.current.forEach((b) => scene.remove(b));
    beams.current = [];

    const createBeam = (color, yOffset = 0) => {
      const geo = new THREE.CylinderGeometry(0.1, 0.3, 30, 8, 1, true);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(position[0], position[1] + yOffset, position[2]);
      mesh.rotation.x = Math.PI / 2;
      scene.add(mesh);
      beams.current.push(mesh);
    };

    createBeam("lime", 0);
    createBeam("orange", 0.5);

    return () => {
      beams.current.forEach((b) => scene.remove(b));
      beams.current = [];
    };
  }, [beamVisible, position, scene]);

  return null;
}


