// CanvasRoot3.jsx

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";

import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";
import PostProcessing3 from "./PostProcessing3";
import BeamEffect from "./BeamEffect";
import CameraController from "./CameraController";
import { useBeamStore } from "@/store/useBeamStore";

// 🔧 exposure のアニメーション管理
function ToneMappingController() {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.0;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    console.log("🟢 ToneMapping 初期化完了");
  }, [gl]);

  useFrame(() => {
    if (gl.toneMappingExposure < 0.5) {
      gl.toneMappingExposure += 0.00028;
    }
  });

  return null;
}

// ✅ Cone の位置を取得して state に反映する Tracker
function BeamOriginTracker({ modelRef, setBeamPosition, setIsModelReady }) {
  const frameCount = useRef(0);
  const lastPosition = useRef(null);
  const hasLoggedMaxFrames = useRef(false);

  useFrame(() => {
    frameCount.current += 1;
    
    if (frameCount.current > 30 && !hasLoggedMaxFrames.current) {
      console.log("🔚 [BeamOriginTracker] Stopping logs after 30 frames");
      hasLoggedMaxFrames.current = true;
    }
    
    if (modelRef.current) {
      let coneMesh = null;
      
      // Cone メッシュを探索
      modelRef.current.traverse((child) => {
        if (child.isMesh && (
          child.name === "Cone_Color_0" || 
          child.name.includes("Cone") || 
          child.name.includes("Star")
        )) {
          coneMesh = child;
          if (frameCount.current <= 30) {
            console.log("🎯 Found target mesh:", child.name);
          }
        }
      });
      
      if (coneMesh) {
        setIsModelReady(true);
        
        // ワールド位置とワールドマトリックスを取得
        const worldPos = new THREE.Vector3();
        coneMesh.updateWorldMatrix(true, false);
        coneMesh.getWorldPosition(worldPos);
        
        if (!lastPosition.current || !worldPos.equals(lastPosition.current)) {
          lastPosition.current = worldPos.clone();
          setBeamPosition(worldPos);
          if (frameCount.current <= 30) {
            console.log("📍 [BeamOriginTracker] Position updated:", {
              meshName: coneMesh.name,
              worldPosition: worldPos.toArray(),
              localPosition: coneMesh.position.toArray(),
              matrix: coneMesh.matrix.elements,
              frame: frameCount.current
            });
          }
        }
      } else if (frameCount.current <= 30 && frameCount.current % 10 === 0) {
        console.log("⏳ [BeamOriginTracker] Waiting for cone mesh...", {
          frame: frameCount.current,
          hasModelRef: !!modelRef.current
        });
      }
    }
  });

  return null;
}

export default function CanvasRoot3() {
  const beamVisible = useBeamStore((state) => state.beamVisible);
  const setBeamVisible = useBeamStore((state) => state.setBeamVisible);
  const [beamPosition, setBeamPosition] = useState(new THREE.Vector3());
  const [isModelReady, setIsModelReady] = useState(false);
  const modelRef = useRef(null);
  const cameraControllerRef = useRef(null);
  const manualOffset = useMemo(() => new THREE.Vector3(0, 0.2, 0), []); // 微調整用オフセット
  const updateCount = useRef(0);
  const hasLoggedMaxUpdates = useRef(false);

  // 🔄 モデルの準備状態を監視
  useEffect(() => {
    updateCount.current += 1;
    if (updateCount.current <= 30) {
      console.log("🔄 [CanvasRoot3] Model ready state changed:", {
        isModelReady,
        hasModelRef: !!modelRef.current,
        hasCone: !!modelRef.current?.cone,
        beamVisible,
        updateCount: updateCount.current
      });
    } else if (!hasLoggedMaxUpdates.current) {
      console.log("🔚 [CanvasRoot3] Stopping state change logs after 30 updates");
      hasLoggedMaxUpdates.current = true;
    }
  }, [isModelReady, modelRef, beamVisible]);

  // 🔄 beamVisible の変更を監視
  useEffect(() => {
    console.log("🎯 [CanvasRoot3] beamVisible state changed:", {
      beamVisible,
      isModelReady,
      hasValidPosition: beamPosition && !beamPosition.equals(new THREE.Vector3()),
      modelRefExists: !!modelRef.current,
      updateCount: updateCount.current
    });
  }, [beamVisible]);

  // 🔄 その他の状態変更を監視  
  useEffect(() => {
    if (updateCount.current <= 30) {
      console.log("🔄 [CanvasRoot3] State update:", {
        beamVisible,
        isModelReady,
        hasValidPosition: beamPosition && !beamPosition.equals(new THREE.Vector3()),
        modelRefExists: !!modelRef.current,
        hasCone: !!modelRef.current?.cone,
        updateCount: updateCount.current
      });
    }
  }, [beamPosition, isModelReady]);

  const createBeam = () => {
    if (!isModelReady) {
      if (updateCount.current <= 30) {
        console.warn("⚠️ [CanvasRoot3] createBeam called but model not ready:", {
          isModelReady,
          hasModelRef: !!modelRef.current,
          beamPosition: beamPosition?.toArray()
        });
      }
      return;
    }

    if (!beamPosition || beamPosition.equals(new THREE.Vector3())) {
      if (updateCount.current <= 30) {
        console.warn("⚠️ [CanvasRoot3] createBeam called but invalid beam position:", {
          hasPosition: !!beamPosition,
          position: beamPosition?.toArray()
        });
      }
      return;
    }

    if (updateCount.current <= 30) {
      console.log("⚡️ [CanvasRoot3] createBeam called", {
        currentVisibility: beamVisible,
        modelReady: isModelReady,
        beamPosition: beamPosition.toArray()
      });
    }
  };

  // 📍 ビーム位置の計算
  const beamStartPos = useMemo(() => {
    if (!beamPosition || !isModelReady) {
      if (updateCount.current <= 30) {
        console.log("⏩ [CanvasRoot3] Skipping beam position calc:", {
          hasPosition: !!beamPosition,
          modelReady: isModelReady,
          position: beamPosition?.toArray()
        });
      }
      return null;
    }

    try {
      const pos = beamPosition.clone().add(manualOffset);
      if (updateCount.current <= 30) {
        console.log("📍 [CanvasRoot3] ビーム開始位置:", {
          original: beamPosition.toArray(),
          withOffset: pos.toArray(),
          offset: manualOffset.toArray()
        });
      }
      return pos;
    } catch (error) {
      console.error("❌ [CanvasRoot3] ビーム位置計算エラー:", error);
      return null;
    }
  }, [beamPosition, manualOffset, isModelReady]);

  // 🟢 グリーンビームの方向と終点
  const greenBeamData = useMemo(() => {
    if (!beamStartPos) {
      if (updateCount.current <= 30) {
        console.log("⏩ [CanvasRoot3] グリーンビーム: beamStartPos なし → スキップ");
      }
      return null;
    }

    try {
      // グリーンビームのパラメータ調整
      const direction = new THREE.Vector3(1, 0.3, 0.27)  // Y軸方向をさらに10度上向きに
        .normalize()
        .multiplyScalar(30);  // ビーム長さを3倍に（倍増）
      const start = beamStartPos.clone().add(new THREE.Vector3(0, -0.1, 0));
      const end = start.clone().add(direction);

      if (updateCount.current <= 30) {
        console.log("🟢 [CanvasRoot3] グリーンビーム計算完了:", {
          start: start.toArray(),
          end: end.toArray(),
          direction: direction.toArray(),
          length: direction.length()
        });
      }
      return { start, end };
    } catch (error) {
      console.error("❌ [CanvasRoot3] グリーンビーム計算エラー:", error);
      return null;
    }
  }, [beamStartPos]);

  // 🟠 オレンジビームの方向と終点
  const orangeBeamData = useMemo(() => {
    if (!beamStartPos) {
      if (updateCount.current <= 30) {
        console.log("⏩ [CanvasRoot3] オレンジビーム: beamStartPos なし → スキップ");
      }
      return null;
    }

    try {
      // オレンジビームのパラメータ調整
      const direction = new THREE.Vector3(1, 0.4, 0.26)  // Y軸方向をさらに上向きに
        .normalize()
        .multiplyScalar(30);  // ビーム長さを3倍に（倍増）
      const start = beamStartPos.clone().add(new THREE.Vector3(0, 0.1, 0));
      const end = start.clone().add(direction);

      if (updateCount.current <= 30) {
        console.log("🟠 [CanvasRoot3] オレンジビーム計算完了:", {
          start: start.toArray(),
          end: end.toArray(),
          direction: direction.toArray(),
          length: direction.length()
        });
      }
      return { start, end };
    } catch (error) {
      console.error("❌ [CanvasRoot3] オレンジビーム計算エラー:", error);
      return null;
    }
  }, [beamStartPos]);

  // 🎯 ビーム表示の条件をチェック
  const shouldShowBeams = useMemo(() => {
    const ready = beamVisible && isModelReady && greenBeamData && orangeBeamData;
    if (updateCount.current <= 30) {
      console.log("🎯 [CanvasRoot3] ビーム表示条件:", {
        beamVisible,
        isModelReady,
        hasGreenData: !!greenBeamData,
        hasOrangeData: !!orangeBeamData,
        ready,
        position: beamPosition?.toArray(),
        greenStart: greenBeamData?.start?.toArray(),
        orangeStart: orangeBeamData?.start?.toArray()
      });
    }
    return ready;
  }, [beamVisible, isModelReady, greenBeamData, orangeBeamData, beamPosition]);

  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [-180, 5, -50], fov: 75 }}
      style={{ width: "100%", height: "100vh", background: "black" }}
    >
      <ToneMappingController />
      <SceneContent3 modelRef={modelRef} />
      <PostProcessing3 />

      <BeamOriginTracker
        modelRef={modelRef}
        setBeamPosition={setBeamPosition}
        setIsModelReady={setIsModelReady}
      />

      {shouldShowBeams && (
        <>
          <BeamEffect
            type="green"
            start={greenBeamData.start}
            end={greenBeamData.end}
            visible={beamVisible}
            alpha={1.5}
          />
          <BeamEffect
            type="orange"
            start={orangeBeamData.start}
            end={orangeBeamData.end}
            visible={beamVisible}
            alpha={1.5}
          />
        </>
      )}

      <CameraController ref={cameraControllerRef} />

      <GuiPanelRoot
        createBeam={createBeam}
        beamVisible={beamVisible}
        setBeamVisible={setBeamVisible}
        modelRef={modelRef}
        cameraControllerRef={cameraControllerRef}
      />
    </Canvas>
  );
}

