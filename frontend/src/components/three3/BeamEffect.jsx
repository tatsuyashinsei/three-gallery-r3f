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

<<<<<<< HEAD
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
=======
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
>>>>>>> 338a77370d23e233cc2c2059ff2b3e3f564322b4
      return null;
    }
  }, [validationResult.isValid, start, end, type]);

<<<<<<< HEAD
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
=======
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
>>>>>>> 338a77370d23e233cc2c2059ff2b3e3f564322b4

  // マテリアル生成
  const material = useMemo(() => {
<<<<<<< HEAD
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
=======
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
    console.log(`[BeamEffect] 👁 visible changed:`, {
      visible,
      hasStart: !!start,
      hasEnd: !!end,
      beamVector: beamVector ? 'valid' : 'invalid'
    });
  }, [visible, start, end, beamVector]);

  // 時間の流れをシェーダーに渡す
>>>>>>> 338a77370d23e233cc2c2059ff2b3e3f564322b4
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
    <mesh ref={meshRef} position={[0, yOffset, 0]} visible={visible}>
      {geometry && <primitive object={geometry} />}
      {material && <primitive object={material} />}
    </mesh>
  );
}