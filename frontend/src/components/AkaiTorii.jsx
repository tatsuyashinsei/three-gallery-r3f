import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import * as THREE from "three"; // ← THREE をインポート

const AkaiTorii = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  restitution = 2.5,
  //   friction = 1,
  //   mass = 3,
}) => {
  const { scene } = useGLTF("/AkaiTorii.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // 🔥 追加
        if (child.material) {
          child.material.shadowSide = THREE.DoubleSide; // 🔥
          child.material.side = THREE.DoubleSide; // 🔥
        }
      }
    });
    return clone;
  }, [scene]);

  const shadowToriiClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;

        // material deep copy
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0;
        child.material.color = new THREE.Color(0x000000);
      }
    });
    return clone;
  }, [scene]);

  return (
    <>
      <RigidBody
        type="dynamic"
        colliders="trimesh"
        mass={1000}
        friction={0.5}
        restitution={restitution}
      >
        <primitive
          object={clonedScene}
          position={position}
          rotation={rotation}
          scale={[0.3, 0.3, 0.3]}
        />
      </RigidBody>

      <primitive
        object={shadowToriiClone}
        position={position}
        rotation={rotation}
        scale={[0.3, 0.3, 0.3]}
      />
    </>
  );
};

export default AkaiTorii;
