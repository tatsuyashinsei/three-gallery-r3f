// vertexBeam.glsl

// ------------------------------------
// 頂点シェーダー – vertexBeam.glsl
// （パーティクルが時間差でループ再誕生）
// ------------------------------------

attribute float aScale;
attribute float aBirthTime;
attribute float aLifetime;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;
uniform float uLengthFactor;
uniform float uYOffset;
uniform vec3 uDirection;

uniform float uFadeInSpeed;
uniform float uAlphaCurve;

varying float vAlpha;

void main() {
  // ------------------------------------
  // ✅ 経過時間をループ式で計算（パーティクルごとの再生処理）
  float age = mod(uTime - aBirthTime, aLifetime);

  // ✅ 進行度（生まれた瞬間=0.0 → 死ぬ直前=1.0）
  float progress = clamp(age / aLifetime, 0.0, 1.0);

  // ------------------------------------
  // 拡散方向をランダム＋フェード付きで計算
  // float spreadPhase = smoothstep(0.0, 0.7, 1.0 - progress); // 終盤で拡散が弱まる
  float spreadPhase = smoothstep(1.4, 0.7, progress); // 終盤で拡散が弱まる
  vec3 dir = normalize(uDirection + aRandomness * spreadPhase * 1.5);

  // ------------------------------------
  // パーティクル位置計算
  vec3 pos = dir * progress * uLengthFactor;
  pos.y += uYOffset;

  // ------------------------------------
  // フェードイン制御（シーン全体の導入タイミング用）
  float fadeIn = clamp(uTime / uFadeInSpeed, 0.0, 1.5);

  // ------------------------------------
  // ✅ 終点でフェードアウト（progressが0.85を超えると透明に）
  float tipFade = smoothstep(0.85, 1.0, progress); // 進行度の終盤
  // float tipAlpha = mix(1.0, 0.0, tipFade);         // 徐々に透明化
  float tipAlpha = mix(1.0, 0.0, tipFade);         // 徐々に透明化

  // ✅ 総合的なアルファ（tipフェード × シーン導入フェード）
  vAlpha = tipAlpha * fadeIn;

  // ------------------------------------
  // ✅ 終点に近づくほど粒子サイズを小さくする（0.3倍まで）
  float tipSize = mix(1.0, 0.3, tipFade * 0.3);
  gl_PointSize = uSize * aScale * tipSize;

  // ------------------------------------
  // ワールド座標 → スクリーン座標へ変換
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
