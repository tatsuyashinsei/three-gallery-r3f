// BeamGeometry.js

import * as THREE from "three";

export function createBeamGeometry({
  direction,
  count = 1000,
  length = 1.0,
  randomness = 0.2,
  birthTimeRange = [0, 5],
  lifetimeRange = [3, 5],
  scaleRange = [0.3, 0.8],
}) {
  // ✅ direction が無効な場合に仮の方向を使用
  const safeDirection =
    direction instanceof THREE.Vector3 && direction.length() > 0
      ? direction.clone().normalize()
      : new THREE.Vector3(1, 0, 0); // fallback

  if (!(direction instanceof THREE.Vector3)) {
    console.warn("[createBeamGeometry] ⚠️ direction が不正。fallback 使用");
  }

  const geo = new THREE.BufferGeometry();
  const positions = [];
  const birthTimes = [];
  const lifetimes = [];
  const scales = [];
  const randVectors = [];

  for (let i = 0; i < count; i++) {
    const progress = Math.random();

    const randomOffset = new THREE.Vector3(
      (Math.random() - 0.5) * randomness * progress,
      (Math.random() - 0.5) * randomness * progress,
      (Math.random() - 0.5) * randomness * progress
    );

    const finalPos = safeDirection
      .clone()
      .multiplyScalar(length * progress)
      .add(randomOffset);

    positions.push(finalPos.x, finalPos.y, finalPos.z);

    // ✅ 寿命と誕生時間の範囲を外部から受け取って調整
    birthTimes.push(
      birthTimeRange[0] +
        Math.random() * (birthTimeRange[1] - birthTimeRange[0])
    );
    lifetimes.push(
      lifetimeRange[0] + Math.random() * (lifetimeRange[1] - lifetimeRange[0])
    );
    scales.push(
      scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0])
    );

    randVectors.push(randomOffset.x, randomOffset.y, randomOffset.z);
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute(
    "aBirthTime",
    new THREE.Float32BufferAttribute(birthTimes, 1)
  );
  geo.setAttribute("aLifetime", new THREE.Float32BufferAttribute(lifetimes, 1));
  geo.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));
  geo.setAttribute(
    "aRandomness",
    new THREE.Float32BufferAttribute(randVectors, 3)
  );

  return geo;
}
