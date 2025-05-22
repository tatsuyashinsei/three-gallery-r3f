// Beams3.jsx
import { useMemo } from "react";
import useGuiStore from "@/store/useGuiStore";
import * as THREE from "three";

export default function Beams3({ position = [0, 0, 0] }) {
  const { beamVisible } = useGuiStore();

  // ✅ Cylinder geometry & material をメモ化（最適化）
  const limeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "lime",
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  const orangeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "orange",
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    []
  );

  const geometry = useMemo(
    () => new THREE.CylinderGeometry(0.1, 0.3, 30, 8, 1, true),
    []
  );

  return (
    <group visible={beamVisible}>
      <mesh
        geometry={geometry}
        material={limeMaterial}
        position={[position[0], position[1], position[2]]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={geometry}
        material={orangeMaterial}
        position={[position[0], position[1] + 0.5, position[2]]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
