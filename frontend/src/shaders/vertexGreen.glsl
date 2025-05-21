// VertexGreen.glsl

//------------------------------------
attribute float aScale;
uniform float uBaseSize;
//------------------------------------

uniform float uTime;
uniform float uLengthFactor;
uniform vec3 uDirectionOffset;  // ✅ XYZそれぞれの偏差
uniform float uAlphaMultiplier; // ✅ 明るさを外部から制御する係数（0.02〜0.05 など）

attribute float aBirthTime;
attribute float aLifetime;

varying float vAlpha;

void main() {
  // パーティクルの現在の年齢（ループするように mod を使用）
  float age = mod(uTime - aBirthTime, aLifetime);

  // 進行度を 0.0 〜 1.0 に正規化
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  // direction（発射方向）をポジションから求める
  vec3 dir = normalize(position);

  // ✅ 外部から渡された方向補正を加える
  dir += uDirectionOffset;

  // ✅ 補正後も正規化し直して進行方向ベクトルとして使う
  dir = normalize(dir);

  // ビームの位置 = direction × 進行度 × 尾の長さ
  vec3 pos = dir * progress * uLengthFactor;

  // アルファ計算（フェードアウト）
  float baseAlpha = pow(1.0 - progress, 1.5);

  // フェードイン効果（開始から1.5秒で最大になる）
  float fadeIn = clamp(uTime / 1.5, 0.0, 0.5);

  // ✅ 明るさ最終値 = base × fadeIn × 外部明るさ補正
  vAlpha = baseAlpha * fadeIn * uAlphaMultiplier * 0.3;

  // 最終ポジションを画面に投影
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  // パーティクルサイズ
  gl_PointSize = 4.0;
}



// VertexGreen.glsl

// uniform float uTime;
// uniform float uLengthFactor;
// uniform float uYOffset; // ✅ Y方向オフセット

// attribute float aBirthTime;
// attribute float aLifetime;

// varying float vAlpha;

// void main() {
//   float age = mod(uTime - aBirthTime, aLifetime);
//   float progress = clamp(age / aLifetime, 0.0, 1.0);

//   // 放射方向に直進
//   vec3 pos = normalize(position) * progress * uLengthFactor;

//   // 通常の進行度に応じたフェード（尻尾の減衰）
//   float baseAlpha = pow(1.0 - progress, 1.5);

//   // 時間ベースのフェードインを追加（1.5秒かけて最大に）
//   float fadeIn = clamp(uTime / 1.5, 0.0, 1.0);

//   // vAlpha = baseAlpha * fadeIn;
//   vAlpha = baseAlpha * fadeIn * uAlphaMultiplier;


//   gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//   gl_PointSize = 5.0;
// }