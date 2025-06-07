// src/hooks/useApplyMaterialSettings.js

import { useEffect } from "react";
import * as THREE from "three";

export function useApplyMaterialSettings(
  modelRef,
  settings,
  // eslint-disable-next-line no-unused-vars
  targetName = null
) {
  useEffect(() => {
    if (!modelRef?.current) return;

    modelRef.current.traverse((child) => {
        if (child.isMesh && child.name === "Cone_Color_0" && child.material) {
            const mat = child.material;

                Object.assign(mat, {
                roughness: settings.roughness,
                metalness: settings.metalness,
                envMapIntensity: settings.envMapIntensity,
                clearcoat: settings.clearcoat,
                iridescence: settings.iridescence,
                transmission: settings.transmission,
                thickness: settings.thickness,
                ior: settings.ior,
                opacity: settings.opacity,
                transparent: settings.opacity < 1,
                emissive: new THREE.Color(0xffeb3b),
                emissiveIntensity: settings.emissiveIntensity,
                });

                mat.needsUpdate = true;
            }
        });
    }, [modelRef, ...Object.values(settings)]);

}
