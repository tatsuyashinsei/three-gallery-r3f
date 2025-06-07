// CanvasRoot3.jsx

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";

import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";
import PostProcessing3 from "./PostProcessing3";
import BeamEffect from "./BeamEffect";
import CameraController from "./CameraController";
import BloomPostProcessing from "./BloomPostProcessing";
import LoaderOverlay from "../LoaderOverlay";
import { useBeamStore } from "@/store/useBeamStore";

// グローバルフラグで演出の重複実行を防ぐ
let globalToneMappingStartTime = null;
let isGlobalToneMappingActive = false;

// 🔧 exposure のアニメーション管理
function ToneMappingController() {
  const { gl, scene } = useThree();
  const startTimeRef = useRef(null);
  const isActiveRef = useRef(true);

  useEffect(() => {
    // より確実にレンダラー設定を適用
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 0.0;  // 初期値をゼロに
    gl.outputColorSpace = THREE.SRGBColorSpace;
    
    // シーンも同様に設定
    scene.background = new THREE.Color(0x000000);  // 完全に黒い背景
    
    // グローバル制御で一度だけ開始
    if (!isGlobalToneMappingActive) {
      globalToneMappingStartTime = performance.now();
      isGlobalToneMappingActive = true;
      startTimeRef.current = globalToneMappingStartTime;
      console.log("🟢 ToneMapping 初期化完了 - 13秒演出開始 (グローバル制御)", { 
        startTime: startTimeRef.current,
        initialExposure: gl.toneMappingExposure,
        renderer: gl,
        toneMapping: gl.toneMapping
      });
    } else {
      startTimeRef.current = globalToneMappingStartTime;
      console.log("🔄 ToneMapping 既存インスタンス検出 - 継続", {
        existingStartTime: globalToneMappingStartTime
      });
    }
    
    isActiveRef.current = true;

    // クリーンアップ関数
    return () => {
      isActiveRef.current = false;
      console.log("🔄 ToneMappingController クリーンアップ");
    };
  }, [gl, scene]);

  useFrame(() => {
    if (!startTimeRef.current || !isActiveRef.current) return;

    const elapsed = performance.now() - startTimeRef.current;
    const exposureDuration = 13000;  // 13秒間の演出
    const exposureTarget = 0.4;      // 白飛びを防ぐためより控えめに

    // イーズイン関数（二次関数 - 最初速く、後で緩やか）
    const easeInQuad = (t) => t * t;

    if (elapsed < exposureDuration) {
      const progress = elapsed / exposureDuration;
      const newExposure = THREE.MathUtils.lerp(
        0,
        exposureTarget,
        easeInQuad(progress)
      );
      
      // より確実に設定
      gl.toneMappingExposure = newExposure;
      
      // デバッグログ（毎フレーム出力して確実に動作確認）
      if (Math.floor(elapsed / 500) % 2 === 0 && elapsed % 500 < 16.67) {
        console.log(`🌅 ToneMapping進行中 (イーズイン): ${(elapsed/1000).toFixed(1)}s / ${exposureDuration/1000}s`, {
          progress: (progress * 100).toFixed(1) + '%',
          exposure: newExposure.toFixed(3),
          glExposure: gl.toneMappingExposure,
          easing: 'ease-in'
        });
      }
    } else {
      gl.toneMappingExposure = exposureTarget;
      if (elapsed - exposureDuration < 100) { // 一度だけログ出力
        console.log("✅ ToneMapping演出完了 (イーズイン)", { 
          finalExposure: gl.toneMappingExposure,
          totalTime: (elapsed/1000).toFixed(1) + 's',
          easing: 'ease-in'
        });
        // 演出完了後はグローバルフラグをリセット（次回のために）
        setTimeout(() => {
          isGlobalToneMappingActive = false;
          globalToneMappingStartTime = null;
        }, 1000);
      }
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
  const modelRef = useRef();
  const cameraControllerRef = useRef();
  const bloomRef = useRef();

  // Loading state management
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ビーム状態管理
  const [beamPosition, setBeamPosition] = useState(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [shouldShowBeams, setShouldShowBeams] = useState(false);
  const [beamVisible, setBeamVisible] = useState(false);

  // GUI状態
  const [emissiveIntensity, setEmissiveIntensity] = useState(7);

  // ビームデータ計算
  const { greenBeamData, orangeBeamData } = useMemo(() => {
    if (!beamPosition) {
      return {
        greenBeamData: { start: new THREE.Vector3(), end: new THREE.Vector3() },
        orangeBeamData: { start: new THREE.Vector3(), end: new THREE.Vector3() }
      };
    }

    return {
      greenBeamData: {
        start: beamPosition.clone(),
        end: beamPosition.clone().add(new THREE.Vector3(50, 10, 20))
      },
      orangeBeamData: {
        start: beamPosition.clone(),
        end: beamPosition.clone().add(new THREE.Vector3(45, 15, 25))
      }
    };
  }, [beamPosition]);

  // ビーム表示の遅延制御
  useEffect(() => {
    if (isModelReady && !isLoading) {
      const timer = setTimeout(() => {
        setShouldShowBeams(true);
      }, 15000); // 15秒後にビーム表示開始

      return () => clearTimeout(timer);
    }
  }, [isModelReady, isLoading]);

  // ローディング進捗シミュレーション（実際のアセット読み込みに合わせて調整可能）
  useEffect(() => {
    let progressTimer;
    let currentProgress = 0;

    const updateProgress = () => {
      currentProgress += Math.random() * 15 + 5; // ランダムに5-20%ずつ増加
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setLoadingProgress(100);
        clearInterval(progressTimer);
      } else {
        setLoadingProgress(Math.floor(currentProgress));
        progressTimer = setTimeout(updateProgress, 200 + Math.random() * 300); // 200-500ms間隔
      }
    };

    // 初期遅延後に進捗開始
    const initialTimer = setTimeout(updateProgress, 300);

    return () => {
      clearTimeout(initialTimer);
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, []);

  // ローディング完了時の処理
  const handleLoadingComplete = () => {
    console.log("🎬 ローディング完了 - アプリケーション開始");
    setIsLoading(false);
  };

  const createBeam = useBeamStore((state) => state.createBeam);

  return (
    <>
      {/* ローディングオーバーレイ */}
      {isLoading && (
        <LoaderOverlay 
          progress={loadingProgress} 
          onLoadingComplete={handleLoadingComplete}
        />
      )}

      <Canvas
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        camera={{ position: [-180, 5, -50], fov: 75 }}
        style={{ width: "100%", height: "100vh", background: "black" }}
        onCreated={({ gl, scene }) => {
          // Canvas作成時に確実に設定
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.0;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = new THREE.Color(0x000000);
          console.log("🎬 Canvas初期化: レンダラー設定完了", {
            toneMapping: gl.toneMapping,
            toneMappingExposure: gl.toneMappingExposure,
            outputColorSpace: gl.outputColorSpace
          });
        }}
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

        <BloomPostProcessing ref={bloomRef} emissiveIntensity={emissiveIntensity} />

        <GuiPanelRoot
          createBeam={createBeam}
          beamVisible={beamVisible}
          setBeamVisible={setBeamVisible}
          modelRef={modelRef}
          cameraControllerRef={cameraControllerRef}
          bloomRef={bloomRef}
          onEmissiveIntensityChange={setEmissiveIntensity}
          isLoading={isLoading}
        />
      </Canvas>
    </>
  );
}

