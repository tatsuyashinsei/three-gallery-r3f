// src/components/three3/panels/EnvPanel3.jsx

import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Html, Stars } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import useGuiStore from "@/store/useGuiStore";

// HDRI 背景の選択肢一覧
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
  particleSystem, // ※未使用化または今後JSXでの置換を推奨
  modelRef,
  greenBeam,
  orangeBeam,
  createBeam,
  loadHDR,
}) {
  const { scene, camera } = useThree();
  const { isLoadingHDR } = useGuiStore();

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

  // 環境テクスチャ & ライト制御
  useEffect(() => {
    scene.environment = environment ? environmentTexture : null;
    if (directionallight) directionallight.visible = !environment;
    if (ambientLight) ambientLight.visible = !environment;
  }, [environment, environmentTexture]);

  // 背景表示制御
  useEffect(() => {
    scene.background =
      background && environmentTexture ? environmentTexture : null;
  }, [background, environmentTexture]);

  // 床のテクスチャと表示制御
  useEffect(() => {
    if (floor1 && floor2) {
      floor1.visible = floor2.visible = planeVisible;

      floor1.material.map = floor1TextureVisible ? texture1 : null;
      floor2.material.map = floor2TextureVisible ? texture2 : null;

      floor1.material.needsUpdate = true;
      floor2.material.needsUpdate = true;
    }
  }, [planeVisible, floor1TextureVisible, floor2TextureVisible]);

  // ビームの生成制御（Coneからのワールド位置取得）
  useEffect(() => {
    greenBeam?.dispose?.();
    orangeBeam?.dispose?.();

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

  // HDRIマップの読み込み
  useEffect(() => {
    const url = envMapList[envMap];
    if (url) loadHDR(url);
  }, [envMap]);

  return (
    <>
      {isLoadingHDR && (
        <Html center>
          <div style={{ color: "white", fontSize: "1.2rem" }}>
            ⏳ 環境マップを読み込み中...
          </div>
        </Html>
      )}

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
