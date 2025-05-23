import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PostProcessing3() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.0, // strength
      1.0, // radius
      0.9 // threshold
    );

    composer.current = new EffectComposer(gl);
    composer.current.addPass(renderPass);
    composer.current.addPass(bloomPass);

    // ウィンドウリサイズ対応
    gl.setSize(size.width, size.height);
    composer.current.setSize(size.width, size.height);
  }, [gl, scene, camera, size]);

  // ✅ useFrame で composer.render() を実行
  useFrame(() => {
    if (composer.current) {
      composer.current.render();
    }
  }, 1); // ← 重要：R3Fのデフォルト描画より「後」に描画

  return null;
}
