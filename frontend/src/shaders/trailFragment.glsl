precision mediump float;
varying float vAlpha;

void main() {
  gl_FragColor = vec4(1.0, 0.5, 0.0, vAlpha);
}
