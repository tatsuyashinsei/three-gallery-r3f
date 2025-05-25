// src/components/three3/Beems/BeamMaterial.js

import * as THREE from "three";
import vertexShader from "@/shaders/vertexBeam.glsl?raw";
import fragmentShader from "@/shaders/fragmentBeam.glsl?raw";

// タイプ別パラメータ定義
const beamTypePresets = {
  green: {
    lengthMultiplier: 1.5,
    fadeInSpeed: 0.5,
    alphaCurve: 1.5,
    sizeMultiplier: 1.0,
    blending: THREE.AdditiveBlending,
  },
  orange: {
    lengthMultiplier: 1.2,
    fadeInSpeed: 0.7,
    alphaCurve: 1.3,
    sizeMultiplier: 1.2,
    blending: THREE.AdditiveBlending,
  },
  default: {
    lengthMultiplier: 1.0,
    fadeInSpeed: 0.6,
    alphaCurve: 1.4,
    sizeMultiplier: 1.0,
    blending: THREE.AdditiveBlending,
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
    },
  });
}

