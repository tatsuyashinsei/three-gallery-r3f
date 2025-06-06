// ------------------------------------
// フラグメントシェーダー – fragmentBeam.glsl
// ------------------------------------

precision mediump float;

uniform vec3 uColor;           // ✅ 外部から渡す色（緑・オレンジなど）
uniform vec3 uMixColor;        // ✅ ミックスする明るい色
uniform float uMixRatio;       // ✅ 色のミックス率
uniform float uEmissionStrength; // ✅ 発光の強さ
varying float vAlpha;

void main() {
  // パーティクル中心からの距離を測定
  float dist = length(gl_PointCoord - vec2(0.5));

  // 円形マスク（周辺部は透明に）
  if (dist > 0.5) discard;

  // 中心部ほど発光を強く（エッジをより暗く）
  float emission = pow(1.0 - dist * 2.0, 1.4) * uEmissionStrength;

  // 基本色をさらに暗く
  vec3 darkColor = uColor * 0.6;  // 基本色を40%暗く
  
  // 基本色と明るい色をミックス
  vec3 baseColor = mix(darkColor, uMixColor, uMixRatio);
  
  // 発光効果を加える（発光色も基本色に合わせる）
  vec3 emissionColor = mix(vec3(1.0), uMixColor, 0.7);  // 発光色をより明るい色寄りに
  vec3 finalColor = baseColor + (emissionColor * emission * 0.8);  // 発光の影響をさらに強く

  // 色と透明度を適用（vAlpha は時間・距離により変動）
  gl_FragColor = vec4(finalColor, vAlpha * 0.5);
}
