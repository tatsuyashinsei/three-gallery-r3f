// src/components/three3/PostProcessing3.jsx

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
  const prevStartRef = useRef(start);
  const prevEndRef = useRef(end);

  // デバッグログ
  useEffect(() => {
    console.log(`[BeamEffect] 🎯 MOUNT: type=${type}, visible=${visible}`);
    return () => {
      console.log(`[BeamEffect] ❌ UNMOUNT: type=${type}`);
    };
  }, [type, visible]);

  // start/endの変更を監視
  useEffect(() => {
    if (start && end) {
      console.log(`[BeamEffect:${type}] 📍 位置更新:`, {
        start: start.toArray(),
        end: end.toArray(),
        visible
      });
      prevStartRef.current = start;
      prevEndRef.current = end;
    }
  }, [start, end, type, visible]);

  // 基本プロパティの計算
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

  // ビームベクトルの計算
  const beamVector = useMemo(() => {
    const currentStart = start || prevStartRef.current;
    const currentEnd = end || prevEndRef.current;

    if (
      !currentStart ||
      !currentEnd ||
      !(currentStart instanceof THREE.Vector3) ||
      !(currentEnd instanceof THREE.Vector3) ||
      currentStart.equals(currentEnd)
    ) {
      console.warn(`[BeamEffect:${type}] 🚫 無効な start/end → ビーム非表示`, {
        start: currentStart?.toArray(),
        end: currentEnd?.toArray()
      });
      return null;
    }

    const dir = currentEnd.clone().sub(currentStart);
    const length = dir.length();
    const normalized = dir.clone().normalize();
    console.log(`[BeamEffect:${type}] 🧭 direction =`, normalized.toArray());
    console.log(`[BeamEffect:${type}] 📏 length =`, length.toFixed(3));
    return { direction: normalized, length };
  }, [start, end, type]);

  // ジオメトリの生成
  const geometry = useMemo(() => {
    if (!beamVector) return null;
    console.log(`[BeamEffect:${type}] 🧱 Generating geometry...`);
    return createBeamGeometry({
      direction: beamVector.direction,
      count: PARTICLE_COUNT,
      length: beamVector.length,
    });
  }, [beamVector, type]);

  // マテリアルの生成
  const material = useMemo(() => {
    if (!beamVector) return null;
    console.log(`[BeamEffect:${type}] 🧪 Creating material...`);
    return createBeamMaterial({
      lengthFactor: beamVector.length,
      alpha,
      direction: beamVector.direction,
      color,
      yOffset,
      start: start || prevStartRef.current,
    });
  }, [beamVector, alpha, color, yOffset, start, type]);

  // アニメーションフレームの更新
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
    <group position={start || prevStartRef.current}>
      <points ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}
