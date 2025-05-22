// panels/ModelPanel3.jsx
// ✅ これは「仮の Box モデル」を GUI で制御するデモ用パネルです
// 本番の `Model3` とは無関係です（混同注意）

import { useControls } from "leva";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ModelPanel3() {
  const meshRef = useRef();

  const { visible, position, scale, rotationSpeed } = useControls(
    "デモモデル",
    {
      visible: true,
      position: {
        value: { x: 0, y: 0, z: 0 },
        step: 0.1,
        label: "位置",
      },
      scale: {
        value: 1,
        min: 0.1,
        max: 5,
        step: 0.1,
        label: "スケール",
      },
      rotationSpeed: {
        value: 0.01,
        min: 0,
        max: 0.1,
        label: "Y軸回転速度",
      },
    }
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <mesh
      ref={meshRef}
      visible={visible}
      position={[position.x, position.y, position.z]}
      scale={[scale, scale, scale]}
    >
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}
