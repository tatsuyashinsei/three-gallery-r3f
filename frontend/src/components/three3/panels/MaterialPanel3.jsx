import { useControls, folder } from "leva";
import { useEffect, forwardRef, useImperativeHandle } from "react";

// 初期値を定数として定義
const INITIAL_VALUES = {
  rotationY: 0,
  positionY: 0,
  envMapIntensity: 1,
  roughness: 0.5,
  metalness: 0.5,
  clearcoat: 0.0,
  iridescence: 0.0,
  transmission: 0.0,
  thickness: 1.0,
  ior: 1.5,
};

const MaterialPanel3 = forwardRef(({ floor1, floor2 }, ref) => {
  const [controls, set] = useControls(() => ({
    "ボード設定": folder({
      rotationY: {
        value: INITIAL_VALUES.rotationY,
        min: -8.154,
        max: 7.573,
        step: 0.001,
        label: "横回転",
      },
      positionY: {
        value: INITIAL_VALUES.positionY,
        min: -60,
        max: 80,
        step: 0.1,
        label: "上下移動",
      },
      envMapIntensity: { value: INITIAL_VALUES.envMapIntensity, min: 0, max: 1, label: "環境強度" },
      roughness: { value: INITIAL_VALUES.roughness, min: 0, max: 1, label: "目の粗さ" },
      metalness: { value: INITIAL_VALUES.metalness, min: 0, max: 1, label: "金属性" },
      clearcoat: { value: INITIAL_VALUES.clearcoat, min: 0, max: 1, label: "クリアコート" },
      iridescence: { value: INITIAL_VALUES.iridescence, min: 0, max: 1, label: "玉虫色" },
      transmission: { value: INITIAL_VALUES.transmission, min: 0, max: 1, label: "透過率" },
      thickness: { value: INITIAL_VALUES.thickness, min: 0, max: 20, label: "厚み" },
      ior: { value: INITIAL_VALUES.ior, min: 1, max: 5, label: "屈折率" },
    }, { collapsed: true })
  }));

  // リセット機能を公開
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log("🔄 [MaterialPanel3] リセット実行");
      
      // 各パラメータを初期値にリセット
      set({
        rotationY: INITIAL_VALUES.rotationY,
        positionY: INITIAL_VALUES.positionY,
        envMapIntensity: INITIAL_VALUES.envMapIntensity,
        roughness: INITIAL_VALUES.roughness,
        metalness: INITIAL_VALUES.metalness,
        clearcoat: INITIAL_VALUES.clearcoat,
        iridescence: INITIAL_VALUES.iridescence,
        transmission: INITIAL_VALUES.transmission,
        thickness: INITIAL_VALUES.thickness,
        ior: INITIAL_VALUES.ior,
      });
      
      console.log("✅ [MaterialPanel3] ボード設定リセット完了");
    }
  }));

  useEffect(() => {
    // 表と裏のメッシュを取得
    const meshes = [
      floor1?.current?.front,
      floor1?.current?.back,
      floor2?.current?.front,
      floor2?.current?.back
    ].filter(Boolean);

    meshes.forEach((mesh) => {
      if (!mesh || !mesh.material) {
        console.warn('Mesh or material not found:', { mesh });
        return;
      }

      console.log('Updating material properties for mesh:', {
        mesh,
        rotationY: controls.rotationY,
        metalness: controls.metalness,
        roughness: controls.roughness
      });

      mesh.rotation.y = controls.rotationY;
      mesh.position.y = controls.positionY;

      const mat = mesh.material;
      mat.envMapIntensity = controls.envMapIntensity;
      mat.roughness = controls.roughness;
      mat.metalness = controls.metalness;
      mat.clearcoat = controls.clearcoat;
      mat.iridescence = controls.iridescence;
      mat.transmission = controls.transmission;
      mat.thickness = controls.thickness;
      mat.ior = controls.ior;
      mat.needsUpdate = true;
    });
  }, [
    floor1,
    floor2,
    controls.rotationY,
    controls.positionY,
    controls.envMapIntensity,
    controls.roughness,
    controls.metalness,
    controls.clearcoat,
    controls.iridescence,
    controls.transmission,
    controls.thickness,
    controls.ior,
  ]);

  return null;
});

MaterialPanel3.displayName = 'MaterialPanel3';

export default MaterialPanel3;
