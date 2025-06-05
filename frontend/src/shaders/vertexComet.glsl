// vertexComet.glsl - Enhanced vertex shader for lifetime-based comet particle effects

precision highp float;  // ✅ precision を追加

attribute float aScale;
attribute float aBirthTime;
attribute float aLifetime;
attribute vec3 aRandomness;
attribute vec3 aVelocity;  // 新しい速度属性

uniform float uSize;
uniform float uTime;
uniform float uLengthFactor;
uniform vec3 uDirection;
uniform vec3 uDirectionOffset;
uniform float uAlphaMultiplier;
uniform float uCometTailLength;
uniform float uScatterStrength;
uniform vec3 uGravity;    // 重力
uniform vec3 uPosition;   // 放出位置

varying float vAlpha;
varying float vProgress;
varying vec3 vColor;

void main() {
  // パーティクルの年齢と進行度を計算
  float age = mod(uTime - aBirthTime, aLifetime);
  float progress = clamp(age / aLifetime, 0.0, 1.0);
  vProgress = progress;

  // パーティクルが生まれているかチェック
  float birthProgress = clamp((uTime - aBirthTime) / aLifetime, 0.0, 1.0);
  if (birthProgress <= 0.0) {
    // まだ生まれていない
    gl_Position = vec4(0.0, 0.0, -1000.0, 1.0); // 画面外に配置
    vAlpha = 0.0;
    gl_PointSize = 0.0;
    return;
  }

  // 物理ベースの位置計算
  vec3 initialPos = position; // 初期位置（放出点周りのランダム）
  
  // 速度による移動
  vec3 velocity = aVelocity;
  vec3 displacement = velocity * age;
  
  // 重力効果
  vec3 gravityEffect = 0.5 * uGravity * age * age;
  
  // 空気抵抗のシミュレーション（オプション）
  float dragFactor = 1.0 - (age * 0.1); // 時間とともに減速
  displacement *= dragFactor;
  
  // ランダムな揺らぎ（風や乱流の効果）
  vec3 turbulence = aRandomness * uScatterStrength * sin(age * 3.14159) * 0.01;
  
  // 最終位置
  vec3 pos = initialPos + displacement + gravityEffect + turbulence;
  
  // アルファ値の計算（寿命に基づくフェード）
  float lifetimeAlpha;
  if (progress < 0.1) {
    // フェードイン
    lifetimeAlpha = progress / 0.1;
  } else if (progress > 0.7) {
    // フェードアウト
    lifetimeAlpha = (1.0 - progress) / 0.3;
  } else {
    // フル表示
    lifetimeAlpha = 1.0;
  }
  
  // 距離に基づくアルファ調整（より控えめに）
  float distanceFactor = length(displacement);
  float distanceAlpha = 1.0 / (1.0 + distanceFactor * 0.01);  // ✅ より見えやすく
  
  // 速度に基づくアルファ（速い粒子は明るく）
  float velocityMagnitude = length(velocity);
  float velocityAlpha = clamp(velocityMagnitude / 10.0, 1.0, 2.0);  // ✅ 最低1.0を保証
  
  // 最終アルファ値（より明るく）
  vAlpha = lifetimeAlpha * distanceAlpha * velocityAlpha * uAlphaMultiplier * 1.5;  // ✅ 1.5倍明るく
  
  // パーティクルサイズ（距離と速度に基づく）
  float sizeFactor = aScale * (1.0 + velocityAlpha * 0.3) * (1.0 - progress * 0.5);
  gl_PointSize = uSize * sizeFactor * 3.0;  // ✅ サイズを3倍に

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
} 