// src/components/three3/GuiPanel3.jsx

import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";
import { useControls } from "leva";

export default function GuiPanel3({
  texture1,
  texture2,
  environmentTexture,
  modelRef,
  createBeam,
  loadHDR,
  testLight,
  modelVisible,
  setModelVisible,
  floorVisible,
  setFloorVisible,
  floor1TextureVisible,
  setFloor1TextureVisible,
  floor2TextureVisible,
  setFloor2TextureVisible,
}) {
  // ✅ LevaでまとめてトグルUIを管理
  useControls("表示切替", {
    "Floor 表示": {
      value: floorVisible,
      onChange: setFloorVisible,
    },
    "Model 表示": {
      value: modelVisible,
      onChange: setModelVisible,
    },
    テクスチャ表: {
      value: floor1TextureVisible,
      onChange: setFloor1TextureVisible,
    },
    テクスチャ裏: {
      value: floor2TextureVisible,
      onChange: setFloor2TextureVisible,
    },
  });

  return (
    <>
      <EnvPanel3
        texture1={texture1}
        texture2={texture2}
        environmentTexture={environmentTexture}
        modelRef={modelRef}
        createBeam={createBeam}
        loadHDR={loadHDR}
        floor1TextureVisible={floor1TextureVisible}
        floor2TextureVisible={floor2TextureVisible}
      />
      <ModelPanel3 modelRef={modelRef} testLight={testLight} />
      <MaterialPanel3 /> {/* Floorの直接操作は削除済みと仮定 */}
    </>
  );
}
