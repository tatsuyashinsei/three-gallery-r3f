// vertexOrange.glsl

uniform float uTime;
uniform float uLengthFactor;
uniform vec3 uDirectionOffset;  // ✅ XYZ方向の補正（例：new THREE.Vector3(0, 0, 0.25) など）
uniform float uAlphaMultiplier; // ✅ 加算ブレンドを抑えるための調整係数

attribute float aBirthTime;
attribute float aLifetime;

varying float vAlpha;

void main() {
  // パーティクルの年齢（ループ処理）
  float age = mod(uTime - aBirthTime, aLifetime);

  // 進行度 0.0 ～ 1.0
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  // 放射方向のベースベクトル
  vec3 dir = normalize(position);

  // ✅ 外部から渡された方向補正を加える
  dir += uDirectionOffset;

  // ✅ 正規化し直して偏りを吸収
  dir = normalize(dir);

  // ビームの位置：dir × 進行度 × 伸び率
  vec3 pos = dir * progress * uLengthFactor;

  // アルファ：進行度によるフェードアウト
  float baseAlpha = pow(1.0 - progress, 1.5) * 0.5;

  // フェードイン：1.5秒かけて最大透明度に
  float fadeIn = clamp(uTime / 10.5, 0.0, 0.5);

  // ✅ 明るさの最終係数
  vAlpha = baseAlpha * fadeIn * uAlphaMultiplier * 0.3;

  // ポジション → スクリーンへ
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  // パーティクルのサイズ
  gl_PointSize = 5.0;

  // //------------------------------------
  // vColor = color;
  // //------------------------------------
}


// uniform float uTime;
// uniform float uLengthFactor;
// uniform float uYOffset; // ✅ Y方向オフセット

// attribute float aBirthTime;
// attribute float aLifetime;

// varying float vAlpha;

// void main() {
//   float age = mod(uTime - aBirthTime, aLifetime);
//   float progress = clamp(age / aLifetime, 0.0, 1.0);

//   vec3 pos = normalize(position) * progress * uLengthFactor;
//   pos.y += uYOffset; // ✅ 上方向にずらす

//   vAlpha = pow(1.0 - progress, 1.5); // ✅ フェードアウトを急カーブに変更
//   vAlpha = baseAlpha * fadeIn * uAlphaMultiplier;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   gl_PointSize = 5.0;
// }