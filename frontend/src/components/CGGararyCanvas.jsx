import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";

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
  const objectIdRef = useRef(0);

  useEffect(() => {
    let isActive = true;
    const interval = setInterval(() => {
      if (objectIdRef.current < 30 && isActive) {
        const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setObjects((prev) => [
          ...prev,
          {
            id: `obj-${Date.now()}-${objectIdRef.current}`,
            type,
            position: [
              Math.random() * 10 - 5,
              Math.random() * 10 + 40,
              Math.random() * 10 - 5,
            ],
          },
        ]);
        objectIdRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "calc(100vh - 64px)", position: "relative" }}>
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          touchAction: "none"
        }}
        camera={{ position: [20, 10, 50], fov: 50 }}
        eventSource={document.getElementById("root")}
        eventPrefix="client"
      >
        <Stars radius={100} depth={50} count={500} factor={4} fade />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 20, 10]} intensity={1} />

        <Physics gravity={[0, -29.81, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
              color="#101010"
              metalness={0.5}
              roughness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>

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
              key={obj.id}
              restitution={0.5}
              friction={0.2}
              colliders="hull"
              position={obj.position}
            >
              <ShapeMesh type={obj.type} />
            </RigidBody>
          ))}
        </Physics>

        <OrbitControls 
          makeDefault
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default CGGararyCanvas;
