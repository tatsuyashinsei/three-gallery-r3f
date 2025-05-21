// lib/loadHDR.js
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";

export function loadHDR(url, scene, gl) {
  const loader = new RGBELoader();

  loader.load(
    url,
    (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

      const pmrem = new THREE.PMREMGenerator(gl);
      const envMap = pmrem.fromEquirectangular(hdrTexture).texture;

      scene.environment = envMap;
      scene.background = hdrTexture;

      hdrTexture.dispose();
      pmrem.dispose();
    },
    undefined,
    (error) => {
      console.error("HDR 読み込み失敗:", error);
    }
  );
}
