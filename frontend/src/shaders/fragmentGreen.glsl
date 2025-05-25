// fragmentGreen.glsl

precision mediump float;

varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.7));
  if (dist > 0.5) discard;

  vec3 green = vec3(0.001, 1.0, 0.001); // 明るい緑（若干黄寄り）
  gl_FragColor = vec4(green, vAlpha);

}


