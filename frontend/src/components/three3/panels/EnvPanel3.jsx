import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useEffect, forwardRef, useImperativeHandle } from "react";
import useGuiStore from "@/store/useGuiStore";

import { useEnvControls, envMapList } from "./Env3Controllers/EnvControls";
import FloorTextureController from "./Env3Controllers/FloorTextureController";
import BeamController from "./Env3Controllers/BeamController";
import BackgroundController from "./Env3Controllers/BackgroundController";

const EnvPanel3 = forwardRef(({
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
}, ref) => {
  const { scene } = useThree();
  const { isLoadingHDR } = useGuiStore();

  const {
    "環境表示": environment,
    "背景表示": background,
    floor1TextureVisible,
    floor2TextureVisible,
    beamVisible,
    envMap,
    resetEnvControls,
  } = useEnvControls();

  // リセット機能を公開
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log("🔄 [EnvPanel3] リセット実行");
      
      // 環境設定を初期値にリセット
      resetEnvControls();
      
      // デフォルト背景画像を読み込み
      loadHDR(envMapList["選択してくださいーー"]);
    }
  }));

  // ✅ 環境マップとライトの切り替え
  useEffect(() => {
    scene.environment = environment ? environmentTexture : null;
    if (directionallight) directionallight.visible = !environment;
    if (ambientLight) ambientLight.visible = !environment;
  }, [environment, environmentTexture]);

  // ✅ 背景テクスチャの設定
  useEffect(() => {
    if (background && environmentTexture) {
      scene.background = environmentTexture;
    } else if (!background) {
      scene.background = null; // Stars 用
    }
  }, [background, environmentTexture]);

  // ✅ HDR 読み込みトリガー
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
            Loading HDR...
          </div>
        </Html>
      )}
    </>
  );
});

EnvPanel3.displayName = 'EnvPanel3';

export default EnvPanel3;
