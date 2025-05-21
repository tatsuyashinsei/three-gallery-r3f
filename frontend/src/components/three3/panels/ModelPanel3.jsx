// panels/ModelPanel3.jsx
import { useControls } from "leva";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ModelPanel3() {
  const meshRef = useRef();

  const { visible, position, scale, rotationSpeed } = useControls("モデル", {
    visible: true,
    position: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
    },
    scale: { value: 1, min: 0.1, max: 5, step: 0.1 },
    rotationSpeed: { value: 0.01, min: 0, max: 0.1 },
  });

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
