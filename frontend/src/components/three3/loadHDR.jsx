// lib/loadHDR.js
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";

/**
 * 環境マップを読み込んでシーンに適用する
 * @param {string} url - HDR 画像の URL
 * @param {THREE.Scene} scene - 現在の Three.js シーン
 * @param {THREE.WebGLRenderer} gl - useThree() から取得した renderer
 */
export function loadHDR(url, scene, gl) {
  const loader = new RGBELoader();

  loader.load(
    url,
    (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

      const pmrem = new THREE.PMREMGenerator(gl);
      pmrem.compileEquirectangularShader();

      const envMap = pmrem.fromEquirectangular(hdrTexture).texture;

      // 背景と環境に適用
      scene.environment = envMap;
      scene.background = hdrTexture;

      // メモリ開放
      hdrTexture.dispose();
      pmrem.dispose();
    },
    undefined,
    (error) => {
      console.error("❌ HDR 読み込み失敗:", error);
    }
  );
}
