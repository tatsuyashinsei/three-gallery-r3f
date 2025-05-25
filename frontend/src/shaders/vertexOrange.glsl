// vertexOrange.glsl

attribute float aScale;
attribute float aBirthTime;
attribute float aLifetime;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;
uniform float uLengthFactor;
uniform vec3 uDirection;
uniform vec3 uDirectionOffset;
uniform float uAlphaMultiplier;

varying float vAlpha;

void main() {
  float age = mod(uTime - aBirthTime, aLifetime);
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  // 拡散は固定値で強め（広がり重視）
  float spreadPhase = 1.2;

  // オフセット込みの方向ベクトル
  vec3 dir = normalize(uDirection + aRandomness * spreadPhase + uDirectionOffset);

  // 位置計算
  vec3 pos = dir * progress * uLengthFactor;

  float baseAlpha = pow(1.0 - progress, 1.3); // 緑より緩やかに減衰
  float fadeIn = clamp(uTime / 0.7, 0.0, 1.2); // 少しゆっくり登場

  vAlpha = baseAlpha * fadeIn * uAlphaMultiplier * 1.2;

  gl_PointSize = uSize * aScale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
