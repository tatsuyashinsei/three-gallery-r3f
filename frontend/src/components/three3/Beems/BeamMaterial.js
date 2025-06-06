// src/components/three3/Beems/BeamMaterial.js

import * as THREE from "three";
import vertexShader from "@/shaders/vertexBeam.glsl?raw";
import fragmentShader from "@/shaders/fragmentBeam.glsl?raw";

// タイプ別パラメータ定義
const beamTypePresets = {
  green: {
    lengthMultiplier: 1.8,
    fadeInSpeed: 0.5,
    alphaCurve: 1.5,
    sizeMultiplier: 1.0,
    blending: THREE.AdditiveBlending,
    emissionStrength: 2.2,  // 発光をさらに強く
    mixColor: new THREE.Color(0.3, 0.7, 0.2),  // さらに暗い緑色
    mixRatio: 0.35,  // ミックス率を上げて発光色の影響を強く
  },
  orange: {
    lengthMultiplier: 1.8,
    fadeInSpeed: 0.8,
    alphaCurve: 1.2,
    sizeMultiplier: 1.3,
    blending: THREE.AdditiveBlending,
    emissionStrength: 2.2,  // 発光をさらに強く
    mixColor: new THREE.Color(0.7, 0.5, 0.1),  // さらに暗いオレンジ色
    mixRatio: 0.35,  // ミックス率を上げて発光色の影響を強く
  },
  default: {
    lengthMultiplier: 1.0,
    fadeInSpeed: 0.6,
    alphaCurve: 1.4,
    sizeMultiplier: 1.0,
    blending: THREE.AdditiveBlending,
    emissionStrength: 2.0,  // 発光をさらに強く
    mixColor: new THREE.Color(0.7, 0.7, 0.4),  // さらに暗いクリーム色
    mixRatio: 0.35,  // ミックス率を上げて発光色の影響を強く
  },
};

export function createBeamMaterial({
  type = "green",
  lengthFactor,
  alpha,
  direction,
  color,
  yOffset,
}) {
  const preset = beamTypePresets[type] || beamTypePresets.default;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: preset.blending,

    uniforms: {
      uTime: { value: 0 },
      uLengthFactor: { value: lengthFactor * preset.lengthMultiplier },
      uAlphaMultiplier: { value: alpha },
      uDirection: { value: direction.clone() },
      uSize: { value: window.devicePixelRatio * preset.sizeMultiplier },
      uColor: { value: color },
      uYOffset: { value: yOffset },
      uFadeInSpeed: { value: preset.fadeInSpeed },
      uAlphaCurve: { value: preset.alphaCurve },
      uEmissionStrength: { value: preset.emissionStrength },
      uMixColor: { value: preset.mixColor },
      uMixRatio: { value: preset.mixRatio },
    },
  });
}

