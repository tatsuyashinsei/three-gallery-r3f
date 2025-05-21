import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Html } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
import useGuiStore from "@/store/useGuiStore"; // ✅ Zustandのストア

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

  useEffect(() => {
    scene.environment = environment ? environmentTexture : null;
    if (directionallight) directionallight.visible = !environment;
    if (ambientLight) ambientLight.visible = !environment;
  }, [environment]);

  useEffect(() => {
    scene.background = background ? environmentTexture : null;
    if (particleSystem) {
      particleSystem.visible = !background;
      particleSystem.position.copy(camera.position);
    }
  }, [background]);

  useEffect(() => {
    if (floor1 && floor2) {
      floor1.visible = floor2.visible = planeVisible;
      floor1.material.map = floor1TextureVisible ? texture1 : null;
      floor2.material.map = floor2TextureVisible ? texture2 : null;
      floor1.material.needsUpdate = floor2.material.needsUpdate = true;
    }
  }, [planeVisible, floor1TextureVisible, floor2TextureVisible]);

  useEffect(() => {
    if (greenBeam) greenBeam.dispose?.();
    if (orangeBeam) orangeBeam.dispose?.();

    if (beamVisible && modelRef) {
      let conePos = new THREE.Vector3();
      modelRef.traverse((child) => {
        if (child.isMesh && child.name === "Cone_Color_0") {
          child.getWorldPosition(conePos);
        }
      });

      createBeam(scene, "green", { position: conePos });
      createBeam(scene, "orange", { position: conePos });
    }
  }, [beamVisible]);

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
    </>
  );
}
