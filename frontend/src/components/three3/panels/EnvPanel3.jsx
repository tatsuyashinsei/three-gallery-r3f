import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect } from "react";
import useGuiStore from "@/store/useGuiStore";
import { useControls } from "leva";


import { useEnvControls, envMapList } from "./Env3Controllers/EnvControls";
import FloorTextureController from "./Env3Controllers/FloorTextureController";
import BeamController from "./Env3Controllers/BeamController";
import BackgroundController from "./Env3Controllers/BackgroundController";

export default function EnvPanel3({
  floor1,
  floor2,
  texture1,
  texture2,
  environmentTexture,
  directionallight,
  ambientLight,
  modelRef,
  greenBeam,
  orangeBeam,
  createBeam,
  loadHDR,
}) {
  const { scene } = useThree();
  const { isLoadingHDR } = useGuiStore();

  // Leva UI 統合コントロール
  const {
    environment,
    background,
    floor1TextureVisible,
    floor2TextureVisible,
    beamVisible,
    envMap,
  } = useControls("環境設定", {
    environment: true,
    background: true,
    floor1TextureVisible: false,
    floor2TextureVisible: false,
    beamVisible: false,
    envMap: {
      options: Object.keys(envMapList),
      value: "選択してくださいーー",
      label: "背景を選択",
    },
  });

  //------------------------------------Faze 2

  // 環境マップとライト切り替え
  useEffect(() => {
    scene.environment = environment ? environmentTexture : null;
    if (directionallight) directionallight.visible = !environment;
    if (ambientLight) ambientLight.visible = !environment;
  }, [environment, environmentTexture]);

  // 背景テクスチャ切り替え
  useEffect(() => {
    scene.background =
      background && environmentTexture ? environmentTexture : null;
  }, [background, environmentTexture]);

  // 床のテクスチャ制御
  useEffect(() => {

    console.log("floor1:", floor1);
    console.log("floor2:", floor2);
    console.log("floor1.material:", floor1?.material);
    console.log("floor2.material:", floor2?.material);
    
    const mesh1 = floor1?.current;
    const mesh2 = floor2?.current;

    if (mesh1?.material) {
      mesh1.material.map = floor1TextureVisible ? texture1 : null;
      mesh1.material.needsUpdate = true;
    }

    if (mesh2?.material) {
      mesh2.material.map = floor2TextureVisible ? texture2 : null;
      mesh2.material.needsUpdate = true;
    }
  }, [
    floor1,
    floor2,
    texture1,
    texture2,
    floor1TextureVisible,
    floor2TextureVisible,
  ]);

  // ビーム生成処理
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
  }, [beamVisible]);

  // HDR 読み込みトリガー
  useEffect(() => {
    const url = envMapList[envMap];
    if (url) loadHDR(url);
  }, [envMap]);

  return (
    <>
      <FloorTextureController
        floor1={floor1}
        floor2={floor2}
        texture1={texture1}
        texture2={texture2}
        floor1TextureVisible={floor1TextureVisible}
        floor2TextureVisible={floor2TextureVisible}
      />

      <BeamController
        scene={scene}
        beamVisible={beamVisible}
        modelRef={modelRef}
        greenBeam={greenBeam}
        orangeBeam={orangeBeam}
        createBeam={createBeam}
      />

      <BackgroundController backgroundEnabled={background} />

      {isLoadingHDR && (
        <Html center>
          <div style={{ color: "white", fontSize: "1.2rem" }}>
            
          </div>
        </Html>
      )}
    </>
  );
}
