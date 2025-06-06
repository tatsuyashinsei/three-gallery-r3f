// BeamEffect.jsx

// src/components/three3/BeamEffect.jsx

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { createBeamGeometry } from "./Beems/BeamGeometry";
import { createBeamMaterial } from "./Beems/BeamMaterial";
import { getColorFromType, getYOffsetFromType } from "./Beems/beamUtils";

const PARTICLE_COUNT = 1000;

export default function BeamEffect({
  type = "green",
  alpha = 1.0,
  visible = true,
  start,
  end,
}) {
  const meshRef = useRef();

  // 各種ビームプロパティを先に定義
  const color = useMemo(() => getColorFromType(type), [type]);
  const yOffset = useMemo(() => getYOffsetFromType(type), [type]);

  // start / end が有効かチェック
  const beamVector = useMemo(() => {
    if (!visible) {
      console.log(`[BeamEffect:${type}] 🚫 visibleがfalse → ビーム非表示`);
      return null;
    }

    if (
      !start ||
      !end ||
      !(start instanceof THREE.Vector3) ||
      !(end instanceof THREE.Vector3) ||
      start.equals(end)
    ) {
      console.warn(
        `[BeamEffect:${type}] 🚫 無効な start/end → ビーム非表示`,
        { start, end }
      );
      return null;
    }

    const dir = end.clone().sub(start);
    return {
      direction: dir.clone().normalize(),
      length: dir.length(),
    };
  }, [start, end, type, visible]);

  const geometry = useMemo(() => {
    if (!beamVector) return null;
    return createBeamGeometry({
      direction: beamVector.direction,
      length: beamVector.length,
      count: PARTICLE_COUNT,
      lifetimeRange: [0.3, 0.5],
      birthTimeRange: [0.3, 0.5],
      useTimeAttributes: true,
    });
  }, [beamVector]);

  // マテリアル生成
  const material = useMemo(() => {
    if (!beamVector) return null;
    return createBeamMaterial({
      type,
      lengthFactor: beamVector.length,
      alpha,
      direction: beamVector.direction,
      color,
      yOffset,
    });
  }, [type, beamVector, alpha, color, yOffset]);

  // デバッグ: mountログ
  useEffect(() => {
    console.log(
      `[BeamEffect] 🏁 MOUNT: type=${type}, visible=${visible}, start=${start?.toArray()}, end=${end?.toArray()}`
    );
    return () => {
      console.log(`[BeamEffect] ❌ UNMOUNT: type=${type}`);
    };
  }, [type, visible, start, end]);

  // visible変更のログ（詳細版）
  useEffect(() => {
    console.log(`[BeamEffect:${type}] 🔄 visible changed:`, {
      visible,
      hasStart: !!start,
      hasEnd: !!end,
      hasGeometry: !!geometry,
      hasMaterial: !!material,
    });
  }, [visible, start, end, geometry, material, type]);

  // アニメーション
  useFrame((state) => {
    if (material?.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // 描画条件のチェック
  if (!visible || !beamVector || !geometry || !material) {
    return null;
  }

  return (
    <group position={start}>
      <points ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}