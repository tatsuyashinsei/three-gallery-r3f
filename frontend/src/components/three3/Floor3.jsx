// src/components/three3/Floor3.jsx

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

export default function Floor3({
  visible = true,
  textureVisible1 = true,
  textureVisible2 = true,
  floorY = -5, // ✅ 追加: 外部から床の高さを渡す
}) {
  const tex1 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
  );
  const tex2 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
  );

  useEffect(() => {
    tex1.colorSpace = THREE.SRGBColorSpace;
    tex2.colorSpace = THREE.SRGBColorSpace;
    tex2.wrapS = THREE.RepeatWrapping;
    tex2.repeat.x = -1;
  }, [tex1, tex2]);

  return (
    <group visible={visible}>
      {/* 表 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, floorY, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial map={textureVisible1 ? tex1 : null} />
      </mesh>

      {/* 裏 */}
      <mesh rotation-x={-Math.PI / 2} position={[0, floorY - 0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhysicalMaterial
          map={textureVisible2 ? tex2 : null}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}




