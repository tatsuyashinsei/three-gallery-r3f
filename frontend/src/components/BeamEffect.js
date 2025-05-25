// src/components/three3/BeamEffect.js
import * as THREE from "three";

import vertexShaderGreen from "../shaders/vertexGreen.glsl?raw";
import fragmentShaderGreen from "../shaders/fragmentGreen.glsl?raw";
import vertexShaderOrange from "../shaders/vertexOrange.glsl?raw";
import fragmentShaderOrange from "../shaders/fragmentOrange.glsl?raw";

const PARTICLE_COUNT = 300_000;

function getBeamParams(type) {
  if (type === "orange") {
    return {
      colorFn: () => [
        1.0,
        0.8 + Math.random() * 0.2,
        0.0 + Math.random() * 0.1,
      ],
      uSize: 128.0,
      scale: 20.0,
      lengthFactor: 6.0,
      rotationZDeg: 21,
      vertex: vertexShaderOrange,
      fragment: fragmentShaderOrange,
    };
  }

  // default: green
  return {
    colorFn: () => [
      0.2 + Math.random() * 0.2,
      0.8 + Math.random() * 0.2,
      0.2 + Math.random() * 0.2,
    ],
    uSize: 154.0,
    scale: 26.0,
    lengthFactor: 8.0,
    rotationZDeg: 13,
    vertex: vertexShaderGreen,
    fragment: fragmentShaderGreen,
  };
}

export function createBeamEffect(
  scene,
  type = "green",
  {
    start = new THREE.Vector3(0, 0, 0),
    end = new THREE.Vector3(1, 0, 0),
    intensityMultiplier = 0.6,
    alphaExponent = 0.5,
    fadeInDuration = 14.5,
  } = {}
) {
  const {
    colorFn,
    uSize,
    scale,
    lengthFactor,
    rotationZDeg,
    vertex,
    fragment,
  } = getBeamParams(type);

  const direction = new THREE.Vector3().subVectors(end, start).normalize();
  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);

  // ---------- Geometry ----------
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const birthTimes = new Float32Array(PARTICLE_COUNT);
  const lifetimes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);

  const RADIUS_MIN = 1.3;
  const RADIUS_MAX = 4.0;
  const RANDOMNESS = 40.0;
  const RANDOMNESS_POWER = 3.0;
  const RANDOM_OFFSET = 0.4;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    const radius = RADIUS_MIN + Math.random() * (RADIUS_MAX - RADIUS_MIN);
    const randomDir = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    const randomStrength =
      Math.pow(Math.random(), RANDOMNESS_POWER) * RANDOMNESS * radius * 2.0;

    const pos = randomDir.multiplyScalar(randomStrength * lengthFactor * 2.0);

    positions[i3 + 0] = pos.x + (Math.random() - 0.5) * RANDOM_OFFSET;
    positions[i3 + 1] = pos.y + (Math.random() - 0.5) * RANDOM_OFFSET;
    positions[i3 + 2] = pos.z + (Math.random() - 0.5) * RANDOM_OFFSET;

    birthTimes[i] = Math.random() * 5.0;
    lifetimes[i] = 2.0 + Math.pow(Math.random(), 2.0) * 2.0;

    const [r, g, b] = colorFn();
    colors[i3 + 0] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;

    scales[i] = 0.5 + Math.pow(Math.random(), 2.0);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aBirthTime", new THREE.BufferAttribute(birthTimes, 1));
  geometry.setAttribute("aLifetime", new THREE.BufferAttribute(lifetimes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  // ---------- Material ----------
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uLengthFactor: { value: lengthFactor },
      uDirection: { value: direction },
      uAlphaMultiplier: { value: intensityMultiplier },
      uSize: { value: uSize },
      uAlphaExponent: { value: alphaExponent },
      uFadeInDuration: { value: fadeInDuration },
    },
  });

  // ---------- Points ----------
  const points = new THREE.Points(geometry, material);
  points.position.copy(midpoint);
  points.scale.setScalar(scale);
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
