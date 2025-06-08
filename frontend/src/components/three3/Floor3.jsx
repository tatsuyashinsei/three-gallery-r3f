// src/components/three3/Floor3.jsx

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { forwardRef, useEffect, useRef } from "react";

const Floor3 = forwardRef(({
  visible = true,
  textureVisible1 = true,
  textureVisible2 = true,
  position = [-133, -11, -36.65], // モデル位置(-140, -2, -38.9)を基準に調整
  rotation = [0, -Math.PI / 1.69, Math.PI], // Z軸回転を追加して面の向きを調整
}, ref) => {
  const groupRef = useRef();
  const floorRef = useRef();
  const floorBackRef = useRef();

  const tex1 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
  );
  const tex2 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
  );

  // refの設定（オブジェクトとして両方のrefを渡す）
  useEffect(() => {
    if (ref) {
      ref.current = {
        front: floorRef.current,
        back: floorBackRef.current
      };
    }
  }, [ref]);

  // テクスチャの初期設定
  useEffect(() => {
    tex1.colorSpace = THREE.SRGBColorSpace;
    tex2.colorSpace = THREE.SRGBColorSpace;
    tex2.wrapS = THREE.RepeatWrapping;
    tex2.wrapT = THREE.RepeatWrapping;
    tex2.repeat.x = -1;
    tex2.center.set(0.5, 0.5);
  }, [tex1, tex2]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={4}>
      {/* 表面のプレート（表面のみ表示） */}
      <mesh ref={floorRef} visible={visible} position={[0.01, 0, 0.01]}>
        <planeGeometry args={[10, 10]} />
        <meshPhysicalMaterial
          side={THREE.FrontSide}
          map={textureVisible1 ? tex1 : null}
          transparent
          opacity={0.9}
          envMapIntensity={1}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>

      {/* 裏面のプレート（裏面のみ表示） */}
      <mesh ref={floorBackRef} visible={visible} position={[-0.01, 0, -0.01]}>
        <planeGeometry args={[10, 10]} />
        <meshPhysicalMaterial
          side={THREE.BackSide}
          map={textureVisible2 ? tex2 : null}
          transparent
          opacity={0.9}
          envMapIntensity={1}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
});

Floor3.displayName = 'Floor3';

export default Floor3;






