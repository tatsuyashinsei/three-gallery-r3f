import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";

const PictureWall = ({ position = [0, 0, 0] }) => {
  const texture = useLoader(THREE.TextureLoader, "/IshiiKing.jpg");
  const meshRef = useRef();

  return (
    <RigidBody
      type="dynamic"
      mass={1000}
      friction={1}
      restitution={0.1}
      colliders="trimesh"
      position={[position[0], position[1] + 12 / 2, position[2]]}
    >
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[4, 12, 4]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
};

export default PictureWall;
