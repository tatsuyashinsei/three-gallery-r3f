// Floor3.jsx

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Floor3({ visible }) {
  const tex1 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
  );
  const tex2 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
  );
  tex1.colorSpace = THREE.SRGBColorSpace;
  tex2.colorSpace = THREE.SRGBColorSpace;
  tex2.wrapS = THREE.RepeatWrapping;
  tex2.repeat.x = -1;

  return (
    <group visible={visible}>
      <mesh rotation-x={-Math.PI / 2} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial map={tex1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -5.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial map={tex2} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}