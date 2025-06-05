// fragmentComet.glsl - Enhanced fragment shader for comet-like beam effects

precision highp float;  // ✅ vertex shaderと同じprecisionに統一

varying float vAlpha;
varying float vProgress;
varying vec3 vColor;

uniform vec3 uBaseColor;
uniform float uTime;

void main() {
  // Create more visible square particles like in the image
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  // Create square-like particles with some roundness
  float squareish = max(abs(coord.x), abs(coord.y));
  float alpha = 1.0 - smoothstep(0.3, 0.5, squareish);
  
  // Add glow effect for visibility
  float glow = exp(-dist * 4.0) * 0.8;
  alpha = clamp(alpha + glow, 0.0, 1.0);
  
  // Enhanced color with higher intensity
  vec3 finalColor = uBaseColor * 2.0; // ✅ さらに明るく
  
  // Create pulsing effect for more dynamic look
  float pulse = sin(uTime * 4.0 + vProgress * 20.0) * 0.2 + 0.8;
  finalColor *= pulse;
  
  // Brighten particles that are closer to source
  float proximityBoost = 1.0 + (1.0 - vProgress) * 1.0;
  finalColor *= proximityBoost;
  
  // Add some color variation for visual interest
  finalColor += vec3(
    sin(uTime * 1.5 + vProgress * 12.0) * 0.15,
    cos(uTime * 2.0 + vProgress * 8.0) * 0.1,
    sin(uTime * 2.5 + vProgress * 10.0) * 0.12
  );
  
  // Ensure minimum visibility（より明るく）
  finalColor = max(finalColor, uBaseColor * 1.0);  // ✅ 最低輝度を上げる
  
  // アルファ値も最低限を保証
  float finalAlpha = max(vAlpha * alpha, 0.3);  // ✅ 最低30%のアルファを保証
  
  gl_FragColor = vec4(finalColor, finalAlpha);
} 