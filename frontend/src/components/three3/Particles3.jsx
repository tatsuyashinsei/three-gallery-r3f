// Particles3.jsx
import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Particles3({ visible = true }) {
  const { geom, mat, mesh } = useMemo(() => {
    const count = 800;
    const radius = 250;
    const positions = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.pow(Math.random(), 0.5);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const mat = new THREE.PointsMaterial({
      color: 0xffffcc,
      size: 5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });

    const mesh = new THREE.Points(geom, mat);
    return { geom, mat, mesh };
  }, []);

  useFrame(() => {
    if (!visible || !mesh) return;
    mesh.rotation.y += 0.001;
  });

  // メモリ解放（アンマウント時）
  useEffect(() => {
    return () => {
      geom.dispose();
      mat.dispose();
    };
  }, []);

  if (!visible) return null;
  return <primitive object={mesh} />;
}
