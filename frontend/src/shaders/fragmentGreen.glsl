// fragmentGreen.glsl

precision mediump float;

varying float vAlpha;

void main() {
  float dist = length(gl_PointCoord - vec2(0.7));
  if (dist > 0.5) discard;

  vec3 green = vec3(0.001, 1.0, 0.001); // 明るい緑（若干黄寄り）
  gl_FragColor = vec4(green, vAlpha);
}

// precision mediump float;

// varying float vAlpha;
// varying vec3 vColor;

// void main() {
//   float dist = length(gl_PointCoord - vec2(0.5));
//   if (dist > 0.5) discard;

//   float strength = 1.0 - dist;
//   strength = pow(strength, 1.0);

//   vec3 finalColor = vColor * strength;
//   gl_FragColor = vec4(finalColor, vAlpha);
// }

