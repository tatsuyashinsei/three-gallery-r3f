// src/components/three3/PostProcessing3.jsx

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createBeamGeometry } from "./Beems/BeamGeometry";
import { createBeamMaterial } from "./Beems/BeamMaterial";
import { getColorFromType, getYOffsetFromType } from "./Beems/beamUtils";

const PARTICLE_COUNT = 50_000;

export default function BeamEffect({
  type = "green",
  alpha = 1.0,
  visible = true,
  start,
  end,
}) {
  const { scene } = useThree();
  const meshRef = useRef();
  const geometryRef = useRef(null);
  const materialRef = useRef(null);
  const hasInitialized = useRef(false);
  const sceneObjectRef = useRef(null);

  // 🧹 Cleanup function
  useEffect(() => {
    return () => {
      // Scene からオブジェクトを削除
      if (sceneObjectRef.current && scene) {
        scene.remove(sceneObjectRef.current);
        console.log(`[BeamEffect:${type}] Scene object removed`);
      }
      
      // リソースを破棄
      if (geometryRef.current) {
        geometryRef.current.dispose();
        geometryRef.current = null;
      }
      if (materialRef.current) {
        materialRef.current.dispose();
        materialRef.current = null;
      }
    };
  }, [scene, type]);

  // 🔍 Props validation
  useEffect(() => {
    if (!start || !end) {
      console.warn(`[BeamEffect:${type}] Invalid props:`, {
        hasStart: !!start,
        hasEnd: !!end,
        visible
      });
      return;
    }

    console.log(`[BeamEffect:${type}] Props updated:`, {
      type,
      visible,
      start: start.toArray(),
      end: end.toArray(),
    });
  }, [type, start, end, visible]);

  // 🧭 Beam vector calculation
  const beamVector = useMemo(() => {
    if (!start || !end) return null;

    try {
      const dir = end.clone().sub(start);
      const length = dir.length();
      const normalized = dir.normalize();
      
      return { direction: normalized, length };
    } catch (error) {
      console.error(`[BeamEffect:${type}] Vector calculation error:`, error);
      return null;
    }
  }, [start, end, type]);

  // 🧱 Geometry creation
  const geometry = useMemo(() => {
    if (!beamVector) return null;

    try {
      const geo = createBeamGeometry({
        direction: beamVector.direction,
        count: PARTICLE_COUNT,
        length: beamVector.length,
      });

      geometryRef.current = geo;
      return geo;
    } catch (error) {
      console.error(`[BeamEffect:${type}] Geometry creation error:`, error);
      return null;
    }
  }, [beamVector, type]);

  // 🎨 Material creation
  const material = useMemo(() => {
    if (!beamVector || !start) return null;

    try {
      const mat = createBeamMaterial({
        lengthFactor: beamVector.length,
        alpha: Math.min(alpha, 1.0),
        direction: beamVector.direction,
        color: getColorFromType(type),
        yOffset: getYOffsetFromType(type),
        start,
      });
      materialRef.current = mat;
      return mat;
    } catch (error) {
      console.error(`[BeamEffect:${type}] Material creation error:`, error);
      return null;
    }
  }, [beamVector, alpha, type, start]);

  // 🎬 Scene management with StrictMode protection
  useEffect(() => {
    if (!geometry || !material || hasInitialized.current) return;

    const points = new THREE.Points(geometry, material);
    points.name = `BeamEffect_${type}`;
    meshRef.current = points;
    sceneObjectRef.current = points;
    hasInitialized.current = true;

    console.log(`[BeamEffect:${type}] Scene object created:`, points.name);
  }, [geometry, material, type]);

  // 👁 Visibility management
  useEffect(() => {
    if (!sceneObjectRef.current || !scene) return;

    if (visible) {
      // Remove if already in scene to prevent duplicates
      scene.remove(sceneObjectRef.current);
      scene.add(sceneObjectRef.current);
      console.log(`[BeamEffect:${type}] Added to scene`);
    } else {
      scene.remove(sceneObjectRef.current);
      console.log(`[BeamEffect:${type}] Removed from scene`);
    }

    return () => {
      scene.remove(sceneObjectRef.current);
    };
  }, [visible, scene, type]);

  // ⏱ Animation frame
  useFrame((state) => {
    if (material?.uniforms?.uTime) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // 🚫 Don't render JSX (we manage scene objects manually)
  return null;
}
