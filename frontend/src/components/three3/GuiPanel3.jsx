// src/components/three3/GuiPanel3.jsx

import { useControls, folder, button } from "leva";
import { useRef } from "react";
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
  cameraControllerRef,
  bloomRef, // ブルーム用のref
  onEmissiveIntensityChange,
}) {
  // リセット用のrefs
  const modelPanelRef = useRef();
  const materialPanelRef = useRef();
  const envPanelRef = useRef();

  // ✅ beamVisible の変更を監視
  useEffect(() => {
    console.log("🔄 [GuiPanel3] beamVisible prop changed:", beamVisible);
  }, [beamVisible]);

  // 発光強度が変更されたときの処理
  const handleEmissiveIntensityChange = (value) => {
    if (onEmissiveIntensityChange) {
      onEmissiveIntensityChange(value);
    }
  };

  // 初期化関数
  const handleReset = () => {
    console.log("🔄 初期化ボタンが押されました");
    
    // 表示切替の初期値にリセット
    setFloorVisible(false);
    setModelVisible(true);
    setFloor1TextureVisible(false);
    setFloor2TextureVisible(false);
    setBeamVisible(false);

    // 発光強度も初期値にリセット
    if (onEmissiveIntensityChange) {
      onEmissiveIntensityChange(7);
    }

    // 各パネルのリセット
    if (modelPanelRef.current?.reset) {
      modelPanelRef.current.reset();
    }
    if (materialPanelRef.current?.reset) {
      materialPanelRef.current.reset();
    }
    if (envPanelRef.current?.reset) {
      envPanelRef.current.reset();
    }

    // カメラのリセット
    if (cameraControllerRef?.current?.reset) {
      cameraControllerRef.current.reset();
    }

    // ブルームのリセット
    if (bloomRef?.current?.reset) {
      bloomRef.current.reset();
    }

    console.log("✅ 全パラメータを初期値にリセットしました");
  };

  // ✅ LevaトグルUI（onChange にロジック含む）
  useControls({
    "表示切替": folder({
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
    }, { collapsed: true })
  });

  // 初期化ボタン
  useControls({
    "🔄 初期化": button(handleReset, {
      disabled: false
    })
  });

  return (
    <>
      <EnvPanel3
        ref={envPanelRef}
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
      <ModelPanel3 
        ref={modelPanelRef}
        modelRef={modelRef} 
        testLight={testLight}
        onEmissiveIntensityChange={handleEmissiveIntensityChange}
      />
      <MaterialPanel3 
        ref={materialPanelRef}
        floor1={floor1} 
        floor2={floor2} 
      />
    </>
  );
}

