// GuiPanel3.jsx

import EnvPanel3 from "./panels/EnvPanel3";
import ModelPanel3 from "./panels/ModelPanel3";
import MaterialPanel3 from "./panels/MaterialPanel3";

export default function GuiPanel3({
  floor1,
  floor2,
  texture1,
  texture2,
  environmentTexture,
  directionallight,
  ambientLight,
  particleSystem,
  modelRef,
  greenBeam,
  orangeBeam,
  createBeam,
  loadHDR,
  testLight,
}) {
  // ✅ ここで確認ログ
  console.log("✅ GuiPanel3 - loadHDR type:", typeof loadHDR);

  return (
    <>
      <EnvPanel3
        floor1={floor1}
        floor2={floor2}
        texture1={texture1}
        texture2={texture2}
        environmentTexture={environmentTexture}
        directionallight={directionallight}
        ambientLight={ambientLight}
        particleSystem={particleSystem}
        modelRef={modelRef}
        greenBeam={greenBeam}
        orangeBeam={orangeBeam}
        createBeam={createBeam}
        loadHDR={loadHDR}
      />
      <ModelPanel3 modelRef={modelRef} testLight={testLight} />
      <MaterialPanel3 floor1={floor1} floor2={floor2} />
    </>
  );
}
