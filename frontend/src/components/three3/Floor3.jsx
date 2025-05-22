// src/components/three3/Floor3.jsx

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Floor3({ visible = true, floorRef = null }) {
  const tex1 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
  );
  const tex2 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
  );

  const groupRef = useRef();

  // ✅ テクスチャの設定（色空間と反転）
  useEffect(() => {
    tex1.colorSpace = THREE.SRGBColorSpace;
    tex2.colorSpace = THREE.SRGBColorSpace;
    tex2.wrapS = THREE.RepeatWrapping;
    tex2.repeat.x = -1;
  }, [tex1, tex2]);

  // ✅ 外部から floorRef 経由で group を操作できるようにする
  useEffect(() => {
    if (floorRef) {
      floorRef.current = groupRef.current;
    }
  }, [floorRef]);

  return (
    <group ref={groupRef} visible={visible}>
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
