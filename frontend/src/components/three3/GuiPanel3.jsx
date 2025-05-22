// src/components/three3/GuiPanel3.jsx

import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";

import { useControls } from "leva";

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

  // ✅ 状態と更新関数（props経由で渡されたもの）
  modelVisible,
  setModelVisible,
  floorVisible,
  setFloorVisible,
}) {
  // ✅ Levaにトグルスイッチを登録（useStateベース）
  useControls("表示切替", {
    "Floor 表示": {
      value: floorVisible,
      onChange: (val) => setFloorVisible(val),
    },
    "Model 表示": {
      value: modelVisible,
      onChange: (val) => setModelVisible(val),
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
      />
      <ModelPanel3 modelRef={modelRef} testLight={testLight} />
      <MaterialPanel3 floor1={floor1} floor2={floor2} />
    </>
  );
}
