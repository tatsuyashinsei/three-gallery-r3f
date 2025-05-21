// GuiPanel3.jsx

import { useEffect } from "react";
import { Pane } from "tweakpane";
import useGuiStore from "../../store/useGuiStore";

export default function GuiPanel3() {
  const {
    environment,
    background,
    planeVisible,
    beamVisible,
    floorMat,
    model,
    toggleBeam,
    toggleEnv,
    togglePlane,
    setFloorMatValue,
    setModelValue,
    resetAll
  } = useGuiStore();

  useEffect(() => {
    const pane = new Pane({
      title: "🎮 コントロールパネル",
      expanded: true,
      container: document.getElementById('gui-container')
    });

    // 環境設定フォルダ
    const envFolder = pane.addFolder({ title: "🌍 環境設定" });
    envFolder.addInput({ environment }, "environment", { label: "HDR環境マップ" })
      .on("change", toggleEnv);
    envFolder.addInput({ planeVisible }, "planeVisible", { label: "床表示" })
      .on("change", togglePlane);
    
    envFolder.addInput({ beamVisible }, "beamVisible", { label: "ビーム効果" })
      .on("change", toggleBeam);

    // モデル設定フォルダ
    const modelFolder = pane.addFolder({ title: "🪐 モデル設定" });
    modelFolder.addInput(model, "scale", { min: 1, max: 10, step: 0.1 })
      .on("change", (ev) => setModelValue("scale", ev.value));
    modelFolder.addInput(model, "posY", { min: -5, max: 5, step: 0.1 })
      .on("change", (ev) => setModelValue("posY", ev.value));
    modelFolder.addInput(model, "rotationY", { min: 0, max: Math.PI * 2, step: 0.01 })
      .on("change", (ev) => setModelValue("rotationY", ev.value));

    // マテリアル設定フォルダ
    const matFolder = pane.addFolder({ title: "🎨 マテリアル設定" });
    matFolder.addInput(floorMat, "roughness", { min: 0, max: 1, step: 0.01 })
      .on("change", (ev) => setFloorMatValue("roughness", ev.value));
    matFolder.addInput(floorMat, "metalness", { min: 0, max: 1, step: 0.01 })
      .on("change", (ev) => setFloorMatValue("metalness", ev.value));
    matFolder.addInput(floorMat, "transmission", { min: 0, max: 1, step: 0.01 })
      .on("change", (ev) => setFloorMatValue("transmission", ev.value));

    // リセットボタン
    pane.addButton({ title: "🔄 設定を初期化" }).on("click", resetAll);

    return () => pane.dispose();
  }, [
    environment,
    background,
    planeVisible,
    beamVisible,
    floorMat,
    model,
    toggleBeam,
    toggleEnv,
    togglePlane,
    setFloorMatValue,
    setModelValue,
    resetAll
  ]);

  return (
    <div
      id="gui-container"
      style={{
        position: 'absolute',
        top: '0',
        right: '0',
        zIndex: '1000',
        padding: '10px'
      }}
    />
  );
}
