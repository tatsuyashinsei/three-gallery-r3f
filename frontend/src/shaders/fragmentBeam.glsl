// ------------------------------------
// フラグメントシェーダー – fragmentBeam.glsl
// ------------------------------------

precision mediump float;

uniform vec3 uColor;     // ✅ 外部から渡す色（緑・オレンジなど）
varying float vAlpha;

void main() {
  // パーティクル中心からの距離を測定
  float dist = length(gl_PointCoord - vec2(0.5));

  // 円形マスク（周辺部は透明に）
  if (dist > 0.5) discard;

  // 色と透明度を適用（vAlpha は時間・距離により変動）
  gl_FragColor = vec4(uColor, vAlpha * 0.5);
}
