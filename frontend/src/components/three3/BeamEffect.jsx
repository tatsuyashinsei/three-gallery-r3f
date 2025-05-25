// BeamEffect.jsx（時間差ループロジック完全対応版）

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { createBeamGeometry } from "./Beems/BeamGeometry";
import { createBeamMaterial } from "./Beems/BeamMaterial";
import { getColorFromType, getYOffsetFromType } from "./Beems/beamUtils";

const PARTICLE_COUNT = 300_000;

export default function BeamEffect({
  type = "green",
  alpha = 1.0,
  visible = true,
  start,
  end,
}) {
  const meshRef = useRef();

  useEffect(() => {
    console.log(
      `[BeamEffect] \u{1F3AF} MOUNT: type=${type}, visible=${visible}`
    );
  }, [type, visible]);

  const color = useMemo(() => {
    const col = getColorFromType(type);
    console.log(`[BeamEffect:${type}] \u{1F3A8} color =`, col);
    return col;
  }, [type]);

  const yOffset = useMemo(() => {
    const y = getYOffsetFromType(type);
    console.log(`[BeamEffect:${type}] \u{2195} yOffset =`, y);
    return y;
  }, [type]);

  const beamVector = useMemo(() => {
    if (
      !start ||
      !end ||
      !(start instanceof THREE.Vector3) ||
      !(end instanceof THREE.Vector3) ||
      start.equals(end)
    ) {
      console.warn(
        `[BeamEffect:${type}] \u{1F6AB} 無効な start/end → ビーム非表示`
      );
      return null;
    }

    const dir = end.clone().sub(start);
    const normalized = dir.clone().normalize();
    const length = dir.length();
    console.log(
      `[BeamEffect:${type}] \u{1F9ED} direction =`,
      normalized.toArray()
    );
    console.log(`[BeamEffect:${type}] \u{1F4CF} length =`, length.toFixed(3));
    return { direction: normalized, length };
  }, [start, end, type]);

  if (!visible || !beamVector) {
    console.log(`[BeamEffect:${type}] \u{1F6AB} スキップ描画`);
    return null;
  }

  const geometry = useMemo(() => {
    console.log(`[BeamEffect:${type}] \u{1F9F1} Generating geometry...`);
    return createBeamGeometry({
      direction: beamVector.direction,
      length: beamVector.length,
      count: PARTICLE_COUNT,
      lifetimeRange: [0.3, 0.5], // 死ぬまでの時間を短く
      birthTimeRange: [0.3, 0.5], // 早めに出現
      useTimeAttributes: true, // ✅ 時間差ロジック用のaBirthTime / aLifetime を埋め込む
    });
  }, [beamVector.direction, beamVector.length, type]);

  const material = useMemo(() => {
    console.log(`[BeamEffect:${type}] \u{1F9EA} Creating material...`);
    return createBeamMaterial({
      type,
      lengthFactor: beamVector.length,
      alpha,
      direction: beamVector.direction,
      color,
      yOffset,
    });
  }, [type, beamVector.length, beamVector.direction, alpha, color, yOffset]);

  useFrame((state) => {
    if (material.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group position={start}>
      <points ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}
