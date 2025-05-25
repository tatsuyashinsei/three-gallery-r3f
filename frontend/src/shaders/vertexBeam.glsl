// vertexBeam.glsl

// ------------------------------------
// 頂点シェーダー – vertexBeam.glsl
// ------------------------------------

attribute float aScale;
attribute float aBirthTime;
attribute float aLifetime;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;
uniform float uLengthFactor;
uniform float uYOffset;
uniform vec3 uDirection;

uniform float uFadeInSpeed;
uniform float uAlphaCurve;

varying float vAlpha;

void main() {
  // ------------------------------------
  // パーティクルの進行度（0.0 ～ 1.0）
  // ------------------------------------
  float age = mod(uTime - aBirthTime, aLifetime);
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  // B地点直前で消す抑制ゾーン
  float suppressZone = smoothstep(0.95, 1.0, progress);

  // ------------------------------------
  // 拡散方向（緩やかに絞る）
  float spreadPhase = smoothstep(0.0, 0.8, 1.0 - progress);
  vec3 dir = normalize(uDirection + aRandomness * spreadPhase);

  // ------------------------------------
  // 進行距離 ＋ Y補正
  vec3 pos = dir * progress * uLengthFactor;
  pos.y += uYOffset;

  // ------------------------------------
  // Alpha 計算（登場・消滅・抑制）
  float fadeIn = clamp(uTime / uFadeInSpeed, 0.0, 1.5);
  float fadeOut = pow(1.0 - progress, uAlphaCurve);
  vAlpha = fadeOut * fadeIn * (1.0 - suppressZone);

  // ------------------------------------
  // サイズ調整（A→Bに向けて細く）
  float sizeFade = fadeOut * (1.0 - suppressZone);
  gl_PointSize = uSize * aScale * sizeFade;

  // ------------------------------------
  // ワールド→スクリーン変換
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
