// Env3Controllers/BeamController.jsx
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
    greenBeam?.dispose?.();
    orangeBeam?.dispose?.();

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
