//BeamEffect.js

import * as THREE from "three";

import vertexShaderGreen from "../shaders/vertexGreen.glsl?raw";
import fragmentShaderGreen from "../shaders/fragmentGreen.glsl?raw";
import vertexShaderOrange from "../shaders/vertexOrange.glsl?raw";
import fragmentShaderOrange from "../shaders/fragmentOrange.glsl?raw";

const PARTICLE_COUNT = 150_000;
const RANDOMNESS = 0.125; // 「乱れ具合」や「自然なゆらぎ」をコントロール
const RANDOMNESS_POWER = 3.0 // 拡散 depthWrite 設定時は2.0確定？
const RANDOM_OFFSET = 0.4;
const RADIUS_BIAS = 10.3; // ビームの開始位置の内側寄りオフセット ***
const GALAXY_RADIUS = 0.002; // ビーム全体の半径的な広がり ***

export function createBeamEffect(
  scene,
  type = "green",
  {
    lengthFactor = 4.0, // 伸び具合
    yOffset = type === "green" ? 0.0 : 0.0,
    rotationZDeg = type === "green" ? 13 : 23, // ビームの傾き
    directionOffset = type === "green" // 向きの偏り
      ? new THREE.Vector3(0.0, -0.1, 0.275)
      : new THREE.Vector3(0.0, -0.1, 0.275),
    position = new THREE.Vector3(0, 0, 0),
    intensityMultiplier = type === "green" ? 0.6 : 1.2, // 明るさ・輝度の強さ
    alphaExponent = type === "green" ? 0.5 : 0.5, // NEW: フェードアウト曲線調整
    fadeInDuration = type === "green" ? 14.5 : 14.5, // NEW: フェードインの所要時間（秒）
    // blendingMode = THREE.AdditiveBlending, // NEW: 合成モード指定
  } = {}
) {
  // ---------- Geometry ----------
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

    birthTimes[i] = Math.random() * 5.0;
    lifetimes[i] = 2.0 + Math.random() * 2.0;

    if (type === "green") {
      colors[i3 + 0] = 0.2 + Math.random() * 0.2;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.2 + Math.random() * 0.2;
    } else {
      colors[i3 + 0] = 1.0;
      colors[i3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i3 + 2] = 0.0 + Math.random() * 0.1;
    }

    scales[i] = 0.5 + Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aBirthTime", new THREE.BufferAttribute(birthTimes, 1));
  geometry.setAttribute("aLifetime", new THREE.BufferAttribute(lifetimes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  // ---------- Material ----------
  const isGreen = type === "green";
  const material = new THREE.ShaderMaterial({
    vertexShader: isGreen ? vertexShaderGreen : vertexShaderOrange,
    fragmentShader: isGreen ? fragmentShaderGreen : fragmentShaderOrange,
    transparent: true,
    depthWrite: true,
    depthTest: true,   // ← デフォルトでtrue、通常はそのままでOK
    // blending: blendingMode,*** //
    blending: THREE.AdditiveBlending, // ***

    // ---------- Uniforms ---------- ******************************************
    uniforms: {
      uTime: { value: 0 },
      uLengthFactor: { value: lengthFactor },
      uYOffset: { value: yOffset },
      uDirectionOffset: { value: directionOffset },
      uAlphaMultiplier: { value: intensityMultiplier },
      uSize: { value: 8.0 }, // パーティクルの基本サイズ
      uAlphaExponent: { value: alphaExponent }, // NEW アルファ減衰のカーブ調整
      uFadeInDuration: { value: fadeInDuration }, // NEW フェードイン秒数
    },
  });

  // ---------- Points ----------
  const points = new THREE.Points(geometry, material);
  points.position.copy(position);
  points.scale.setScalar(16.0);
  points.rotation.z = THREE.MathUtils.degToRad(rotationZDeg);
  scene.add(points);

  // ---------- Return ----------
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
