// src/components/three3/Beams3.jsx

import { useMemo } from "react";
import * as THREE from "three";
import useGuiStore from "@/store/useGuiStore";

export default function Beams3({ position = [0, 0, 0], visible: propVisible }) {
  // Zustandからビーム表示状態を取得（fallback用）
  const storeVisible = useGuiStore((state) => state.beamVisible);

  // 明示的に渡された visible を優先
  const isVisible = propVisible !== undefined ? propVisible : storeVisible;

  // ジオメトリとマテリアルのメモ化
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.1, 0.3, 30, 8, 1, true);
  }, []);

  const limeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "lime",
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
  }, []);

  const orangeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: "orange",
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
  }, []);

  const [x, y, z] = position;

  return (
    <group visible={isVisible}>
      <mesh
        geometry={geometry}
        material={limeMaterial}
        position={[x, y, z]}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={geometry}
        material={orangeMaterial}
        position={[x, y + 0.5, z]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
