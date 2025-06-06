// src/components/three3/Floor3.jsx

import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Floor3({
  visible = true,
  textureVisible1 = true,
  textureVisible2 = true,
  position = [-133, -11, -36.65], // モデル位置(-140, -2, -38.9)を基準に調整
  rotation = [0, -Math.PI / 1.69, 0], // 回転値を統一
}) {
  const floorRef = useRef();
  const floorBackRef = useRef();

  const tex1 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg"
  );
  const tex2 = useTexture(
    "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg"
  );

  // テクスチャの初期設定
  useEffect(() => {
    tex1.colorSpace = THREE.SRGBColorSpace;
    tex2.colorSpace = THREE.SRGBColorSpace;
    tex2.wrapS = THREE.RepeatWrapping;
    tex2.wrapT = THREE.RepeatWrapping;
    tex2.repeat.x = -1;
    tex2.center.set(0.5, 0.5);
  }, [tex1, tex2]);

  // テクスチャの表示/非表示を制御
  useEffect(() => {
    if (floorRef.current?.material) {
      floorRef.current.material.map = textureVisible1 ? tex1 : null;
      floorRef.current.material.needsUpdate = true;
    }
    if (floorBackRef.current?.material) {
      floorBackRef.current.material.map = textureVisible2 ? tex2 : null;
      floorBackRef.current.material.needsUpdate = true;
    }
  }, [textureVisible1, textureVisible2, tex1, tex2]);

  // 裏メッシュを毎フレーム追従させる
  useFrame(() => {
    if (floorRef.current && floorBackRef.current) {
      floorBackRef.current.position.copy(floorRef.current.position);
      floorBackRef.current.position.z -= -10.1;
      floorBackRef.current.rotation.copy(floorRef.current.rotation);
    }
  });

  return (
    <group visible={visible}>
      {/* 表 */}
      <mesh ref={floorRef} position={position} rotation={rotation}>
        <planeGeometry args={[25, 25]} />
        <meshPhysicalMaterial
          side={THREE.FrontSide}
          transparent={true}
          map={textureVisible1 ? tex1 : null}
        />
      </mesh>

      {/* 裏 */}
      <mesh ref={floorBackRef}>
        <planeGeometry args={[25, 25]} />
        <meshPhysicalMaterial
          side={THREE.BackSide}
          transparent={true}
          map={textureVisible2 ? tex2 : null}
        />
      </mesh>
    </group>
  );
}






