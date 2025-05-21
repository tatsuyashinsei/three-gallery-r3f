// otherSceneParts.jsx

import { forwardRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useThree } from "@react-three/fiber";

const Model = forwardRef((props, ref) => {
  const { scene: mainScene } = useThree();

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb",
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((c) => {
          c.castShadow = c.receiveShadow = true;
        });
        scene.position.set(-140, -2, -38.9);
        scene.rotation.y = Math.PI / 2.35;
        scene.scale.setScalar(5);

        if (ref?.current) {
          ref.current.add(scene);
        } else {
          mainScene.add(scene);
        }
      },
      undefined,
      (error) => {
        console.error("GLTF load error:", error);
      }
    );
  }, []);

  return null;
});

export default Model;

