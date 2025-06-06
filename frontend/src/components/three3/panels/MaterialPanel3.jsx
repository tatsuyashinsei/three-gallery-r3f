import { useControls } from "leva";
import { useEffect } from "react";

export default function MaterialPanel3({ floor1, floor2 }) {
  const {
    rotationY,
    positionY,
    envMapIntensity,
    roughness,
    metalness,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
  } = useControls("Floor Material", {
    rotationY: {
      value: 0,
      min: -8.154,
      max: 7.573,
      step: 0.001,
      label: "横回転",
    },
    positionY: {
      value: 0,
      min: -60,
      max: 80,
      step: 0.1,
      label: "上下移動",
    },
    envMapIntensity: { value: 1, min: 0, max: 1, label: "環境強度" },
    roughness: { value: 0.5, min: 0, max: 1, label: "目の粗さ" },
    metalness: { value: 0.5, min: 0, max: 1, label: "金属性" },
    clearcoat: { value: 0.0, min: 0, max: 1, label: "クリアコート" },
    iridescence: { value: 0.0, min: 0, max: 1, label: "玉虫色" },
    transmission: { value: 0.0, min: 0, max: 1, label: "透過率" },
    thickness: { value: 1.0, min: 0, max: 20, label: "厚み" },
    ior: { value: 1.5, min: 1, max: 5, label: "屈折率" },
  });

  useEffect(() => {
    const meshes = [floor1?.current, floor2?.current];
    meshes.forEach((mesh) => {
      if (!mesh || !mesh.material) {
        console.warn('Mesh or material not found:', { mesh });
        return;
      }

      console.log('Updating material properties:', {
        rotationY,
        metalness,
        roughness
      });

      mesh.rotation.y = rotationY;
      mesh.position.y = positionY;

      const mat = mesh.material;
      mat.envMapIntensity = envMapIntensity;
      mat.roughness = roughness;
      mat.metalness = metalness;
      mat.clearcoat = clearcoat;
      mat.iridescence = iridescence;
      mat.transmission = transmission;
      mat.thickness = thickness;
      mat.ior = ior;
      mat.needsUpdate = true;
    });
  }, [
    floor1,
    floor2,
    rotationY,
    positionY,
    envMapIntensity,
    roughness,
    metalness,
    clearcoat,
    iridescence,
    transmission,
    thickness,
    ior,
  ]);

  return null;
}
