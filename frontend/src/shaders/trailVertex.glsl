uniform float uTime;
attribute float aOffset;
varying float vAlpha;

void main() {
  vec3 pos = position;
  pos.x += sin(uTime * 10.0 + aOffset * 5.0) * 2.0;
  pos.z += cos(uTime * 10.0 + aOffset * 5.0) * 2.0;
  vAlpha = 1.0 - aOffset;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
