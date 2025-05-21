//BeamEffectM.js

import * as THREE from "three";

import vertexShaderGreen from "../shaders/vertexGreen.glsl?raw";
import fragmentShaderGreen from "../shaders/fragmentGreen.glsl?raw";
import vertexShaderOrange from "../shaders/vertexOrange.glsl?raw";
import fragmentShaderOrange from "../shaders/fragmentOrange.glsl?raw";

const PARTICLE_COUNT = 5000; // ← ★ 超軽量化
const RANDOMNESS = 0.1;
const RANDOMNESS_POWER = 2.0;
const RANDOM_OFFSET = 0.3;
const RADIUS_BIAS = 1.0;
const GALAXY_RADIUS = 1.2;

export function createBeamEffectM(
  scene,
  type = "green",
  {
    lengthFactor = 2.0,
    yOffset = type === "green" ? 0.0 : 0.1,
    rotationZDeg = type === "green" ? 13 : 23,
    directionOffset = new THREE.Vector3(0, -0.1, 0.2),
    position = new THREE.Vector3(0, 0, 0),
    intensityMultiplier = type === "green" ? 0.4 : 0.6,
    alphaExponent = 0.8,
    fadeInDuration = 1.0,
    particleSize = 2.5, // ← サイズ小さく
  } = {}
) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const birthTimes = new Float32Array(PARTICLE_COUNT);
  const lifetimes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    const r = RADIUS_BIAS + Math.random() * (GALAXY_RADIUS - RADIUS_BIAS);
    const rand = () =>
      Math.pow(Math.random(), RANDOMNESS_POWER) *
      (Math.random() < 0.5 ? 1 : -1) *
      RANDOMNESS *
      r;
    const jitter = () => (Math.random() - 0.5) * RANDOM_OFFSET;

    positions[i3 + 0] = r + rand() + jitter();
    positions[i3 + 1] = rand() + jitter();
    positions[i3 + 2] = rand() + jitter();

    birthTimes[i] = Math.random() * 2.0;
    lifetimes[i] = 1.0 + Math.random() * 1.5;

    if (type === "green") {
      colors[i3 + 0] = 0.2 + Math.random() * 0.2;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      colors[i3 + 0] = 1.0;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.0 + Math.random() * 0.1;
    }

    scales[i] = 0.3 + Math.random() * 0.3;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aBirthTime", new THREE.BufferAttribute(birthTimes, 1));
  geometry.setAttribute("aLifetime", new THREE.BufferAttribute(lifetimes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const isGreen = type === "green";
  const material = new THREE.ShaderMaterial({
    vertexShader: isGreen ? vertexShaderGreen : vertexShaderOrange,
    fragmentShader: isGreen ? fragmentShaderGreen : fragmentShaderOrange,
    transparent: true,
    depthWrite: false, // ← モバイルでは false 推奨
    depthTest: true,
    blending: THREE.NormalBlending, // ← Additive より負荷軽減・互換性高
    uniforms: {
      uTime: { value: 0 },
      uLengthFactor: { value: lengthFactor },
      uYOffset: { value: yOffset },
      uDirectionOffset: { value: directionOffset },
      uAlphaMultiplier: { value: intensityMultiplier },
      uSize: { value: particleSize },
      uAlphaExponent: { value: alphaExponent },
      uFadeInDuration: { value: fadeInDuration },
    },
  });

  const points = new THREE.Points(geometry, material);
  points.position.copy(position);
  points.scale.setScalar(5.0); // ← 元よりだいぶ小さい
  points.rotation.z = THREE.MathUtils.degToRad(rotationZDeg);
  scene.add(points);

  return {
    update(elapsed) {
      material.uniforms.uTime.value = elapsed;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    },
  };
}

