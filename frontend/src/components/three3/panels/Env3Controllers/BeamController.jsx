// src/components/three3/panels/Env3Controllers/BeamController.jsx

import { useEffect } from "react";
import * as THREE from "three";

export default function BeamController({
  scene,
  beamVisible,
  modelRef,
  greenBeam,
  orangeBeam,
  createBeam,
}) {
  useEffect(() => {
    // 💥 既存ビームがあれば、シーンから削除して破棄する
    if (greenBeam) {
      scene.remove(greenBeam);
      greenBeam.geometry?.dispose?.();
      greenBeam.material?.dispose?.();
    }

    if (orangeBeam) {
      scene.remove(orangeBeam);
      orangeBeam.geometry?.dispose?.();
      orangeBeam.material?.dispose?.();
    }

    // ✅ beamVisible が true のときのみ再生成
    if (beamVisible && modelRef) {
      const conePos = new THREE.Vector3();

      modelRef.traverse((child) => {
        if (child.isMesh && child.name === "Cone_Color_0") {
          child.getWorldPosition(conePos);
        }
      });

      createBeam(scene, "green", { position: conePos });
      createBeam(scene, "orange", { position: conePos });
    }
  }, [beamVisible, modelRef, scene, greenBeam, orangeBeam, createBeam]);

  return null;
}
