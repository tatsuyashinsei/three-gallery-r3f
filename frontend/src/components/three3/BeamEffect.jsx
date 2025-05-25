// src/components/three3/BeamEffect.jsx

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
    console.log(`[BeamEffect] 🎯 MOUNT: type=${type}, visible=${visible}`);
  }, [type, visible]);

  const color = useMemo(() => {
    const col = getColorFromType(type);
    console.log(`[BeamEffect:${type}] 🎨 color =`, col);
    return col;
  }, [type]);

  const yOffset = useMemo(() => {
    const y = getYOffsetFromType(type);
    console.log(`[BeamEffect:${type}] ↕ yOffset =`, y);
    return y;
  }, [type]);

  // ✅ ベクトル計算：start / end が不正なら return null
  const beamVector = useMemo(() => {
    if (
      !start ||
      !end ||
      !(start instanceof THREE.Vector3) ||
      !(end instanceof THREE.Vector3) ||
      start.equals(end)
    ) {
      console.warn(`[BeamEffect:${type}] 🚫 無効な start/end → ビーム非表示`);
      return null;
    }

    const dir = end.clone().sub(start);
    const normalized = dir.clone().normalize();
    const length = dir.length();
    console.log(`[BeamEffect:${type}] 🧭 direction =`, normalized.toArray());
    console.log(`[BeamEffect:${type}] 📏 length =`, length.toFixed(3));
    return { direction: normalized, length };
  }, [start, end, type]);

  // ✅ 非表示または無効ベクトルなら描画中止
  if (!visible || !beamVector) {
    console.log(`[BeamEffect:${type}] 🚫 スキップ描画`);
    return null;
  }

  const geometry = useMemo(() => {
    console.log(`[BeamEffect:${type}] 🧱 Generating geometry...`);
    return createBeamGeometry({
      direction: beamVector.direction,
      length: beamVector.length,
      count: PARTICLE_COUNT,
    });
  }, [beamVector.direction, beamVector.length, type]);

  const material = useMemo(() => {
    console.log(`[BeamEffect:${type}] 🧪 Creating material...`);
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
