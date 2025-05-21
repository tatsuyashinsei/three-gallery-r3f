// lib/loadJPGEnvironment.js
import * as THREE from "three";

export async function loadJPGEnvironment(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        console.log("🟢 [loadJPGEnvironment] テクスチャ読み込み成功:", texture);
        resolve(texture); // ✅ 読み込み成功 → 呼び出し側で使う
      },
      undefined,
      (err) => reject(err) // ✅ エラー処理
    );
  });
}
