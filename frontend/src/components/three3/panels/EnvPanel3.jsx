import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Html } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import useGuiStore from "@/store/useGuiStore"; // ✅ Zustandのストア

import { Stars } from "@react-three/drei";


// 背景マップのURL一覧
const envMapList = {
  選択してくださいーー:
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
  "いちばん星前・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mid.jpg",
  "グリコ・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mid.jpg",
  "阿倍野ハルカス・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_mid.jpg",
};

export default function EnvPanel3({
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
}) {
  const { scene, camera } = useThree();
  const { isLoadingHDR } = useGuiStore(); // ✅ ローディング状態取得

  const {
    environment,
    background,
    planeVisible,
    floor1TextureVisible,
    floor2TextureVisible,
    beamVisible,
    envMap,
  } = useControls("環境設定", {
    environment: true,
    background: true,
    planeVisible: false,
    floor1TextureVisible: false,
    floor2TextureVisible: false,
    beamVisible: false,
    envMap: {
      options: Object.keys(envMapList),
      value: "選択してくださいーー",
      label: "背景を選択",
    },
  });

  // 環境マップの適用とライトの制御
  useEffect(() => {
    scene.environment = environment ? environmentTexture : null;

    if (directionallight) directionallight.visible = !environment;
    if (ambientLight) ambientLight.visible = !environment;
  }, [environment, environmentTexture]);

  // 背景とパーティクル表示の制御（パーティクル操作はここに集約）
  useEffect(() => {
    console.log("🔍 background:", background);
    console.log("🔍 environmentTexture:", environmentTexture);

    // 背景テクスチャを適用またはクリア
    scene.background =
      background && environmentTexture ? environmentTexture : null;

    // パーティクル表示切り替え
    if (particleSystem) {
      const shouldShow = !background;

      if (shouldShow) {
        if (!scene.children.includes(particleSystem)) {
          scene.add(particleSystem);
          console.log("🟢 particleSystem added to scene");
        }
        particleSystem.position.copy(camera.position);
      } else {
        if (scene.children.includes(particleSystem)) {
          scene.remove(particleSystem);
          console.log("🔴 particleSystem removed from scene");
        }
      }
    }
  }, [background, environmentTexture]);

  // 床の表示・テクスチャ制御
  useEffect(() => {
    if (floor1 && floor2) {
      floor1.visible = floor2.visible = planeVisible;

      floor1.material.map = floor1TextureVisible ? texture1 : null;
      floor2.material.map = floor2TextureVisible ? texture2 : null;

      floor1.material.needsUpdate = true;
      floor2.material.needsUpdate = true;
    }
  }, [planeVisible, floor1TextureVisible, floor2TextureVisible]);

  // ビームの生成制御
  useEffect(() => {
    if (greenBeam) greenBeam.dispose?.();
    if (orangeBeam) orangeBeam.dispose?.();

    if (beamVisible && modelRef) {
      const conePos = new THREE.Vector3();

      modelRef.traverse((child) => {
        if (child.isMesh && child.name === "Cone_Color_0") {
          child.getWorldPosition(conePos);
        }
      });

      createBeam(scene, "green", { position: conePos });
      createBeam(scene, "orange", { position: conePos });
    }
  }, [beamVisible]);

  // 環境マップの読み込みトリガー
  useEffect(() => {
    const url = envMapList[envMap];
    if (url) loadHDR(url);
  }, [envMap]);

  return(
    <>
      {isLoadingHDR && (
        <Html center>
          <div style={{ color: "white", fontSize: "1.2rem" }}>
            ⏳ 環境マップを読み込み中...
          </div>
        </Html>
      )}

      {/* ✅ 背景がオフならスター表示 */}
      {!background && (
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          fade
          speed={0.5}
        />
      )}
    </>
  );

}
