// TheSun.jsx
import React from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const TheSun = () => {
  const sunPosition = [4, 12, -7.5];

  return (
    <>
      <mesh position={sunPosition}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="lightcyan" />
      </mesh>

      <mesh position={sunPosition}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="white" transparent opacity={0.1} />
      </mesh>

      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.6} intensity={3} />
      </EffectComposer>
    </>
  );
};

export default TheSun;
