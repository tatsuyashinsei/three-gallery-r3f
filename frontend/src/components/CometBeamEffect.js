// CometBeamEffect.js - Enhanced beam effect with comet-like scattering
import * as THREE from "three";

import vertexShaderComet from "../shaders/vertexComet.glsl?raw";
import fragmentShaderComet from "../shaders/fragmentComet.glsl?raw";

const PARTICLE_COUNT = 1000; // ✅ 元の最適化済み数量

function getCometBeamParams(type) {
  if (type === "yellow") {
    return {
      colorFn: () => [
        1.0,                    // Full red
        0.9 + Math.random() * 0.1,  // High green (makes it yellow)
        0.0 + Math.random() * 0.2,  // Low blue for yellow/orange
      ],
      baseColor: new THREE.Vector3(1.0, 0.95, 0.1), // Bright yellow
      uSize: 500.0,           // ✅ さらに大きなパーティクル
      scale: 80.0,            // ✅ より大きなスケール
      lengthFactor: 30.0,     // Longer trails
      rotationZDeg: 18,
      vertex: vertexShaderComet,
      fragment: fragmentShaderComet,
    };
  }

  // Enhanced green for comet effect
  return {
    colorFn: () => [
      0.1 + Math.random() * 0.3,   // Some red for warmth
      0.9 + Math.random() * 0.1,   // High green
      0.2 + Math.random() * 0.4,   // Some blue for variety
    ],
    baseColor: new THREE.Vector3(0.1, 0.95, 0.3), // Bright green
    uSize: 480.0,           // ✅ さらに大きなパーティクル
    scale: 75.0,            // ✅ より大きなスケール
    lengthFactor: 25.0,     // Long trails
    rotationZDeg: 15,
    vertex: vertexShaderComet,
    fragment: fragmentShaderComet,
  };
}

export function createCometBeamEffect(
  scene,
  type = "green",
  {
    position = new THREE.Vector3(0, 0, 0),  // 放出位置（旧start）
    direction = new THREE.Vector3(1, 0, 0), // 放出方向（正規化済み）
    velocity = 8.0,                         // ✅ より高速で素早く消える
    spread = 0.3,                          // 放出角度の広がり（ラジアン）
    intensityMultiplier = 3.0,  // ✅ より明るく
    // alphaExponent = 0.1,        // ✅ より見えやすく (一時的に無効)
    // fadeInDuration = 20.0,      // (一時的に無効)
    lifetimeRange = [0.8, 1.5],            // ✅ 短い寿命でパフォーマンス改善
    // cometTailLength = 8.0,      // (一時的に無効)
    scatterStrength = 60.0,
    // gravity = new THREE.Vector3(0, -0.5, 0), // 重力効果（一時的に無効）
  } = {}
) {
  const {
    colorFn,
    baseColor,
    uSize,
    scale,
    // lengthFactor,   // (一時的に無効)
    rotationZDeg,
    // vertex,         // (一時的に無効)
    // fragment,       // (一時的に無効)
  } = getCometBeamParams(type);

  // 方向を正規化
  const normalizedDirection = direction.clone().normalize();

  console.log(`[createCometBeamEffect] type=${type}`);
  console.log(`[createCometBeamEffect] position=`, position.toArray());
  console.log(`[createCometBeamEffect] direction=`, normalizedDirection.toArray());
  console.log(`[createCometBeamEffect] velocity=${velocity}`);
  console.log(`[createCometBeamEffect] spread=${spread}`);
  console.log(`[createCometBeamEffect] uSize=${uSize}, scale=${scale}`);
  console.log(`[createCometBeamEffect] intensityMultiplier=${intensityMultiplier}`);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);  // 新しい速度属性
  const birthTimes = new Float32Array(PARTICLE_COUNT);
  const lifetimes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const scales = new Float32Array(PARTICLE_COUNT);

  // Enhanced parameters for comet-like effect
  const RADIUS_MIN = 0.5;
  const RADIUS_MAX = 8.0;
  const RANDOMNESS = scatterStrength;        // Customizable scatter
  const RANDOMNESS_POWER = 2.5;             // More dramatic power curve
  const RANDOM_OFFSET = 1.2;                // Increased randomness
  const COMET_SPREAD = 3.0;                 // Additional comet spread

  // ✅ ビーム状の線形配置
  const beamLength = 15.0; // ビームの長さ
  
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    
    // ✅ パーティクルを線状に配置（0から1の進行度）
    const progress = i / (PARTICLE_COUNT - 1);
    
    // ビーム方向に沿った基本位置
    const basePosition = normalizedDirection.clone().multiplyScalar(progress * beamLength);
    
    // わずかなランダム散らばり（線状を保ちつつ）
    const scatter = 0.1; // ✅ 非常に小さな散らばり
    const randomOffset = new THREE.Vector3(
      (Math.random() - 0.5) * scatter,
      (Math.random() - 0.5) * scatter,
      (Math.random() - 0.5) * scatter
    );
    
    const finalPosition = basePosition.add(randomOffset);
    
    positions[i3 + 0] = finalPosition.x;
    positions[i3 + 1] = finalPosition.y;
    positions[i3 + 2] = finalPosition.z;

    // ✅ 固定速度（進行方向）
    velocities[i3 + 0] = normalizedDirection.x * velocity;
    velocities[i3 + 1] = normalizedDirection.y * velocity;
    velocities[i3 + 2] = normalizedDirection.z * velocity;

    // ✅ パーティクル誕生時間を段階的に設定（線状波動効果）
    birthTimes[i] = progress * 0.3; // 先頭から尾にかけて順次発生
    lifetimes[i] = lifetimeRange[0] + Math.random() * (lifetimeRange[1] - lifetimeRange[0]);

    // 色（進行度に応じて変化）
    const [r, g, b] = colorFn();
    const intensity = 1.0 - progress * 0.3; // 先頭が明るく、尾が暗く
    colors[i3 + 0] = r * intensity;
    colors[i3 + 1] = g * intensity;
    colors[i3 + 2] = b * intensity;

    // ✅ サイズも進行度に応じて変化（彗星尾効果）
    scales[i] = (1.0 - progress * 0.7) * (0.5 + Math.random() * 0.5);
  }

  console.log("[createCometBeamEffect] sample lifetimes:", lifetimes.slice(0, 10));
  console.log("[createCometBeamEffect] sample birthTimes:", birthTimes.slice(0, 10));
  console.log("[createCometBeamEffect] sample velocities:", velocities.slice(0, 9));

  // ランダム属性
  const randomness = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    randomness[i3 + 0] = (Math.random() - 0.5) * 2.0;
    randomness[i3 + 1] = (Math.random() - 0.5) * 2.0;
    randomness[i3 + 2] = (Math.random() - 0.5) * 2.0;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));  // 新しい速度属性
  geometry.setAttribute("aBirthTime", new THREE.BufferAttribute(birthTimes, 1));
  geometry.setAttribute("aLifetime", new THREE.BufferAttribute(lifetimes, 1));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));

  // ✅ 軽量なShaderMaterialに戻す
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aScale;
      attribute float aBirthTime;
      attribute float aLifetime;
      
      uniform float uTime;
      uniform float uSize;
      
      varying float vAlpha;
      
      void main() {
        float age = mod(uTime - aBirthTime, aLifetime);
        float progress = clamp(age / aLifetime, 0.0, 1.0);
        
        // Simple fade in/out
        vAlpha = 1.0 - progress;
        
        gl_PointSize = uSize * aScale;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;
      
      void main() {
        gl_FragColor = vec4(uColor, vAlpha * 0.8);
      }
    `,
    uniforms: {
      uTime: { value: 0.0 },
      uSize: { value: 8.0 },
      uColor: { value: baseColor },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.position.copy(position);  // 放出位置に配置
  points.scale.setScalar(scale);
  points.rotation.z = THREE.MathUtils.degToRad(rotationZDeg);
  scene.add(points);

  return {
    update(elapsed) {
      // ✅ シェーダーのuniformを更新
      material.uniforms.uTime.value = elapsed;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    },
    // 新しいメソッド：放出位置と方向を動的に変更
    setPosition(newPosition) {
      points.position.copy(newPosition);
    },
    setDirection(/* newDirection */) {
      // const normalized = newDirection.normalize(); // (一時的に無効)
    },
  };
}

// Enhanced function for creating multiple comet beams
export function createCometBeamCluster(
  scene,
  {
    position = new THREE.Vector3(0, 0, 0),
    direction = new THREE.Vector3(1, 0, 0),
    beamCount = 3,
    spreadAngle = Math.PI / 6,  // 30 degree spread
    colors = ["green", "yellow", "green"],
  } = {}
) {
  const beams = [];
  
  for (let i = 0; i < beamCount; i++) {
    const angle = (i - beamCount / 2) * (spreadAngle / beamCount);
    const beamDirection = direction.clone().applyAxisAngle(
      new THREE.Vector3(0, 0, 1), 
      angle
    );
    
    const beamType = colors[i % colors.length];
    
    const beam = createCometBeamEffect(scene, beamType, {
      position: position,
      direction: beamDirection,
      velocity: 5.0,
      spread: 0.3,
      intensityMultiplier: 0.8 + Math.random() * 0.6,
      alphaExponent: 0.05,
      fadeInDuration: 20.0,
      lifetimeRange: [2.0, 4.0],
      cometTailLength: 6.0 + Math.random() * 4.0,
      scatterStrength: 45.0 + Math.random() * 30.0,
      gravity: new THREE.Vector3(0, -0.5, 0),
    });
    
    beams.push(beam);
  }
  
  return {
    update(elapsed) {
      beams.forEach(beam => beam.update(elapsed));
    },
    dispose() {
      beams.forEach(beam => beam.dispose());
    },
  };
} 