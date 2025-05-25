// vertexGreen.glsl

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

  // 緩やかに拡散を減らす
  float spreadPhase = smoothstep(0.0, 0.8, 1.0 - progress);

  // オフセット + 拡散 + 進行方向を加味した方向ベクトル
  vec3 dir = normalize(uDirection + aRandomness * spreadPhase + uDirectionOffset);

  // 位置を進行度に応じて前進させる
  vec3 pos = dir * progress * uLengthFactor;

  float baseAlpha = pow(1.0 - progress, 1.5);
  float fadeIn = clamp(uTime / 0.5, 0.0, 1.5);

  vAlpha = baseAlpha * fadeIn * uAlphaMultiplier * 1.3;

  gl_PointSize = uSize * aScale;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
