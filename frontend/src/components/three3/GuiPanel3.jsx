// src/components/three3/GuiPanel3.jsx

import { useControls } from "leva";
import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";
import { useEffect } from "react";

export default function GuiPanel3({
  floor1,
  floor2,
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
  beamVisible,
  setBeamVisible,
}) {
  // ✅ beamVisible の変更を監視
  useEffect(() => {
    console.log("🔄 [GuiPanel3] beamVisible prop changed:", beamVisible);
  }, [beamVisible]);

  // ✅ LevaトグルUI（onChange にロジック含む）
  useControls("表示切替", {
    "ボード表示": {
      value: floorVisible,
      onChange: setFloorVisible,
    },
    "モデル表示": {
      value: modelVisible,
      onChange: setModelVisible,
    },
    "表面表示": {
      value: floor1TextureVisible,
      onChange: setFloor1TextureVisible,
    },
    "裏面表示": {
      value: floor2TextureVisible,
      onChange: setFloor2TextureVisible,
    },
    "ほうき星": {
      value: beamVisible,
      onChange: (val) => {
        console.log("🎯 [GuiPanel3] ビーム表示トグル onChange called:", {
          newValue: val,
          previousValue: beamVisible,
          setBeamVisibleFunction: !!setBeamVisible
        });
        setBeamVisible(val);
        console.log("✅ [GuiPanel3] setBeamVisible called with:", val);
        if (val) {
          console.log("⚡️ [GuiPanel3] createBeam 発火");
          createBeam();
        }
      },
    },
  });

  return (
    <>
      <EnvPanel3
        floor1={floor1}
        floor2={floor2}
        texture1={texture1}
        texture2={texture2}
        environmentTexture={environmentTexture}
        modelRef={modelRef}
        createBeam={createBeam}
        loadHDR={loadHDR}
        testLight={testLight}
      />
      <ModelPanel3 modelRef={modelRef} testLight={testLight} />
      <MaterialPanel3 floor1={floor1} floor2={floor2} />
    </>
  );
}

