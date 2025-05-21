import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls, Stars, Reflector } from "@react-three/drei";
import { useState, useEffect } from "react";

const LoginCanvas = () => {
  const [spheres, setSpheres] = useState([]);

  useEffect(() => {
    let sphereCount = 0;
    const interval = setInterval(() => {
      if (sphereCount < 30) {
        setSpheres((prev) => [
          ...prev,
          {
            id: sphereCount,
            position: [
              Math.random() * 10 - 5,
              Math.random() * 10 + 40,
              Math.random() * 10 - 5,
            ],
          },
        ]);
        sphereCount++;
      }
      if (sphereCount >= 30) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas
      style={{
        width: "100%",
        height: "42.25vw", // 16:9
        maxHeight: "300px",
        background: "black",
      }}
      camera={{ position: [0, 20, 60], fov: 50 }}
    >
      {/* 背景 */}
      <Stars radius={100} depth={50} count={500} factor={4} fade />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} intensity={1} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Reflector (見た目用の反射床) */}
        <Reflector
          resolution={1024}
          args={[50, 50]}
          mirror={1}
          mixBlur={10}
          mixStrength={1}
          blur={[500, 100]}
          depthScale={-1.5}
          minDepthThreshold={0.9}
          maxDepthThreshold={1}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -5, 0]}
        />

        {/* 物理床 (見えないコリジョン用) */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, -5, 0]}>
            <boxGeometry args={[50, 1, 50]} />
            <meshStandardMaterial transparent opacity={0.2} /> {/* ←透明 */}
          </mesh>
        </RigidBody>

        {/* 球体 */}
        {spheres.map((sphere) => (
          <RigidBody
            key={`sphere-${sphere.id}`}
            restitution={0.8}
            friction={0.5}
            colliders="ball"
            position={sphere.position}
          >
            <mesh>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshStandardMaterial
                color="orange"
                metalness={0.6}
                roughness={0.1}
              />
            </mesh>
          </RigidBody>
        ))}
      </Physics>

      <OrbitControls />
    </Canvas>
  );
};

export default LoginCanvas;
