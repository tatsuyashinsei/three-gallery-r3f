// src/components/three3/GuiPanel3.jsx

import { useControls } from "leva";
import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";
import { useEffect } from "react";

export default function GuiPanel3({
  texture1,
  texture2,
  environmentTexture,
  modelRef,
  createBeam,
  removeBeam, // 🆕 追加！
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
<<<<<<< HEAD
  // ✅ beamVisible の変更を監視
  useEffect(() => {
    console.log("🔄 [GuiPanel3] beamVisible prop changed:", beamVisible);
  }, [beamVisible]);

  // ✅ LevaトグルUI（onChange にロジック含む）
=======
>>>>>>> 338a77370d23e233cc2c2059ff2b3e3f564322b4
  useControls("表示切替", {
    "Floor 表示": {
      value: floorVisible,
      onChange: setFloorVisible,
    },
    "Model 表示": {
      value: modelVisible,
      onChange: setModelVisible,
    },
    "ボード（表）表示": {
      value: floor1TextureVisible,
      onChange: setFloor1TextureVisible,
    },
    "ボード（裏）表示": {
      value: floor2TextureVisible,
      onChange: setFloor2TextureVisible,
    },
    ビーム表示: {
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
        } else {
          console.log("🛑 removeBeam 発火");
          removeBeam?.(); // removeBeam が存在すれば呼び出す
        }
      },
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
      <MaterialPanel3 />
    </>
  );
}

