// src/components/three3/GuiPanel3.jsx

import EnvPanel3 from "./panels/EnvPanel3"
import ModelPanel3 from "./panels/ModelPanel3"
import MaterialPanel3 from "./panels/MaterialPanel3"
import { useControls } from "leva"

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
  })

  return (
    <>
      {/* 各種パネルをまとめてUIとして構成 */}
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
  )
}

