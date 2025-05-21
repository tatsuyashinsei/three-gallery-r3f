// otherSceneParts.jsx
import Model from "./Model3";

export default function OtherSceneParts({
  floor1Ref,
  floor2Ref,
  modelRef,
  directionallightRef,
  ambientLightRef,
  testLightRef,
  particleSystemRef,
}) {
  return (
    <>
      <mesh
        ref={floor1Ref}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[5, 5]} />
        <meshPhysicalMaterial />
      </mesh>

      <mesh ref={floor2Ref} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshPhysicalMaterial />
      </mesh>

      <Model ref={modelRef} />

      <directionalLight
        ref={directionallightRef}
        position={[3, 5, 2]}
        intensity={2}
      />
      <ambientLight ref={ambientLightRef} intensity={0.5} />
      <pointLight ref={testLightRef} position={[0, 3, 0]} intensity={5} />

      <group ref={particleSystemRef}>
        {/* パーティクルなどがここに来る予定 */}
      </group>
    </>
  );
}
