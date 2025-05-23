// Lights3.jsx

import { useRef, useEffect } from "react";

export default function Lights3({ dirRef, ambientRef }) {
  const internalDirRef = useRef();
  const internalAmbRef = useRef();

  useEffect(() => {
    if (dirRef) dirRef.current = internalDirRef.current;
    if (ambientRef) ambientRef.current = internalAmbRef.current;
  }, [dirRef, ambientRef]);

  return (
    <>
      <ambientLight
        ref={internalAmbRef}
        intensity={Math.PI / 16}
        color={0xebfeff}
      />
      <directionalLight
        ref={internalDirRef}
        intensity={Math.PI * 0.5}
        color={0xebfeff}
        position={[-12, 0.1, 1]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={500}
      />
    </>
  );
}
