// fragmentOrange.glsl

precision mediump float;

varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.7));
  if (dist > 0.5) discard;

  vec3 orange = vec3(1.0, 0.9, 0.0); // より黄色寄りにしてもOK
  gl_FragColor = vec4(orange, vAlpha); // ✅ vAlpha を適用
}

