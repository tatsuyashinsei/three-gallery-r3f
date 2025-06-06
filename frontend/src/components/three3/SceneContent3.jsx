// SceneContent3.jsx

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model3 from "./Model3";

export default function SceneContent3({ onSceneReady, modelRef }) {
  const { scene } = useThree();

  useEffect(() => {
    if (onSceneReady && scene) {
      console.log("[SceneContent3] ✅ シーンが準備完了", {
        hasModelRef: !!modelRef?.current,
        scene: scene
      });
      onSceneReady(scene);
    }
  }, [onSceneReady, scene, modelRef]);

  return (
    <>
      <OrbitControls enableDamping makeDefault />
      <Model3 
        modelRef={modelRef} 
        onLoad={(model) => {
          console.log("[SceneContent3] ✅ モデルの初期化完了", {
            model: model,
            ref: modelRef?.current
          });
        }}
      />
    </>
  );
}
