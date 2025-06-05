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

  // ライフサイクルログ
  useEffect(() => {
    console.log(`[BeamEffect] 🎯 MOUNT: type=${type}, visible=${visible}`);
    return () => {
      console.log(`[BeamEffect:${type}] 🔚 UNMOUNT`);
    };
  }, [type, visible]);

  // 状態変更ログ
  useEffect(() => {
    console.log(`🔄 [BeamEffect:${type}] visible prop changed:`, visible);
  }, [visible, type]);

  // 位置チェック
  useEffect(() => {
    console.log(`🔍 [BeamEffect:${type}] Position check:`, {
      start: start?.toArray?.(),
      end: end?.toArray?.(),
      isValid: start instanceof THREE.Vector3 && end instanceof THREE.Vector3 && !start?.equals?.(end)
    });
  }, [start, end, type]);

  // 基本プロパティ
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

  // 検証結果
  const validationResult = useMemo(() => {
    if (!visible) {
      return { isValid: false, reason: 'visible is false' };
    }
    if (!start || !end || !(start instanceof THREE.Vector3) || !(end instanceof THREE.Vector3)) {
      return { isValid: false, reason: 'invalid start/end vectors' };
    }
    if (start.equals(end)) {
      return { isValid: false, reason: 'start equals end' };
    }
    return { isValid: true, reason: null };
  }, [visible, start, end]);

  // ビームベクトル計算
  const beamVector = useMemo(() => {
    if (!validationResult.isValid) return null;
    
    try {
      const dir = end.clone().sub(start);
      const length = dir.length();
      const normalized = dir.normalize();
      
      console.log(`[BeamEffect:${type}] 🧭 direction =`, normalized.toArray());
      console.log(`[BeamEffect:${type}] 📏 length =`, length.toFixed(3));
      
      return { direction: normalized, length };
    } catch (error) {
      console.error(`[BeamEffect:${type}] ビームベクトル計算エラー:`, error);
      return null;
    }
  }, [validationResult.isValid, start, end, type]);

  // ジオメトリ生成
  const geometry = useMemo(() => {
    if (!beamVector) return null;
    
    try {
      console.log(`[BeamEffect:${type}] 🧱 Generating geometry...`);
      return createBeamGeometry({
        direction: beamVector.direction,
        count: PARTICLE_COUNT,
        length: beamVector.length,
      });
    } catch (error) {
      console.error(`[BeamEffect:${type}] ジオメトリ生成エラー:`, error);
      return null;
    }
  }, [beamVector, type]);

  // マテリアル生成
  const material = useMemo(() => {
    if (!beamVector || !geometry) return null;
    
    try {
      console.log(`[BeamEffect:${type}] 🧪 Creating material...`);
      return createBeamMaterial({
        lengthFactor: beamVector.length,
        alpha,
        direction: beamVector.direction,
        color,
        yOffset,
        start,
      });
    } catch (error) {
      console.error(`[BeamEffect:${type}] マテリアル生成エラー:`, error);
      return null;
    }
  }, [beamVector, geometry, alpha, color, yOffset, start, type]);

  // アニメーション
  useFrame((state) => {
    if (material?.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // 最終検証
  if (!validationResult.isValid) {
    console.log(`[BeamEffect:${type}] 🚫 スキップ描画: ${validationResult.reason}`);
    return null;
  }

  if (!beamVector || !geometry || !material) {
    console.warn(`[BeamEffect:${type}] 🚫 必要なコンポーネントが不足:`, {
      hasBeamVector: !!beamVector,
      hasGeometry: !!geometry,
      hasMaterial: !!material
    });
    return null;
  }

  // 描画
  console.log(`[BeamEffect:${type}] 🎬 Rendering beam effect`);
  return (
    <group position={start}>
      <points ref={meshRef} geometry={geometry} material={material} />
    </group>
  );
}