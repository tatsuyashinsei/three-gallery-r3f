import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls, Stars, Reflector } from "@react-three/drei";
import { useState, useEffect } from "react";

const SHAPES = ["sphere", "box", "icosahedron", "torusKnot", "cylinder"];

const ShapeMesh = ({ type }) => {
  switch (type) {
    case "sphere":
      return (
        <mesh>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="orange"
            metalness={0.6}
            roughness={0.1}
          />
        </mesh>
      );
    case "box":
      return (
        <mesh>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial
            color="skyblue"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      );
    case "icosahedron":
      return (
        <mesh>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="hotpink"
            metalness={0.7}
            roughness={0.15}
          />
        </mesh>
      );
    case "torusKnot":
      return (
        <mesh>
          <torusKnotGeometry args={[1.2, 0.4, 100, 16]} />
          <meshStandardMaterial color="lime" metalness={0.6} roughness={0.1} />
        </mesh>
      );
    case "cylinder":
      return (
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 8, 32]} />
          <meshStandardMaterial
            color="purple"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      );
    default:
      return null;
  }
};

const CGGararyCanvas = () => {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 30) {
        const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setObjects((prev) => [
          ...prev,
          {
            id: count,
            type,
            position: [
              Math.random() * 10 - 5,
              Math.random() * 10 + 40,
              Math.random() * 10 - 5,
            ],
          },
        ]);
        count++;
      }
      if (count >= 30) {
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas
      style={{
        width: "100%",
        height: "56.25vw",
        maxHeight: "400px",
        background: "black",
      }}
      camera={{ position: [20, 10, 50], fov: 50 }}
    >
      <Stars radius={100} depth={50} count={500} factor={4} fade />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 20, 10]} intensity={1} />

      <Physics gravity={[0, -29.81, 0]}>
        <Reflector
          resolution={1024}
          args={[50, 50]}
          mirror={1}
          mixBlur={0.1}
          mixStrength={1}
          blur={[200, 100]}
          depthScale={-1.5}
          minDepthThreshold={0.9}
          maxDepthThreshold={10}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -5, 0]}
        />

        <RigidBody
          canSleep
          restitution={0.1}
          friction={0.1}
          type="fixed"
          colliders="trimesh"
        >
          <mesh position={[0, -5, 0]}>
            <boxGeometry args={[50, 1, 50]} />
            <meshStandardMaterial transparent opacity={0.2} />
          </mesh>
        </RigidBody>

        {objects.map((obj) => (
          <RigidBody
            key={`obj-${obj.id}`}
            restitution={0.5}
            friction={0.2}
            colliders="hull"
            position={obj.position}
          >
            <ShapeMesh type={obj.type} />
          </RigidBody>
        ))}
      </Physics>

      <OrbitControls />
    </Canvas>
  );
};

export default CGGararyCanvas;
