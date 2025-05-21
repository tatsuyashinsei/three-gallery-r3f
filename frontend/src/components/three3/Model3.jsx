// Model3.jsx

import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useThree } from "@react-three/fiber";

export default function Model3() {
  const { scene: mainScene } = useThree();
  const [model, setModel] = useState(null);

  useEffect(() => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );

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

        mainScene.add(scene);
        setModel(scene);
      },
      undefined,
      (error) => {
        console.error("GLTF load error:", error);
      }
    );

    return () => {
      if (model) mainScene.remove(model);
    };
  }, []);

  return null;
}
