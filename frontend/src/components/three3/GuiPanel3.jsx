// src/components/three3/GuiPanel3.jsx

import { useControls } from "leva";
import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";

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
        console.log("🟢 ビーム表示トグル:", val);
        setBeamVisible(val);
        if (val) {
          console.log("🎯 createBeam 発火");
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

