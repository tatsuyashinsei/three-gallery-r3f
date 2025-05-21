// SceneContent3.jsx

import { Suspense, useEffect } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

import Lights3 from "./Lights3";
import Model3 from "./Model3";
import Trail3 from "./Trail3";
import PostProcessing3 from "./PostProcessing3";
import Beams3 from "./Beams3";
import Particles3 from "./Particles3";
import Floor3 from "./Floor3";

import useGuiStore from "../../store/useGuiStore";

export default function SceneContent3({ onSceneReady }) {
  const { beamVisible, environment, planeVisible, particleVisible } =
    useGuiStore();
  const { gl, scene } = useThree();

  useEffect(() => {
    if (onSceneReady && scene) {
      onSceneReady(scene);
    }
  }, [onSceneReady, scene]);

  useEffect(() => {
    if (!environment) {
      scene.environment = null;
      scene.background = null;
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(gl);
        const envMap = pmrem.fromEquirectangular(texture).texture;

        scene.environment = envMap;
        scene.background = texture;

        scene.traverse((child) => {
          if (child.material && "envMapIntensity" in child.material) {
            child.material.envMapIntensity = 0.0;
          }
        });

        texture.dispose();
        pmrem.dispose();
      },
      undefined,
      (err) => console.error("環境マップの読み込み失敗:", err)
    );
  }, [environment, gl, scene]);

  return (
    <>
      <Lights3 />

      <Suspense fallback={<Html>Loading model...</Html>}>
        <Model3 />
      </Suspense>

      <Trail3 />
      <Floor3 visible={planeVisible} />
      <Particles3 />
      {beamVisible && <Beams3 position={[0, 5, 0]} />}

      <OrbitControls enableDamping makeDefault />
      <PostProcessing3 />
    </>
  );
}
