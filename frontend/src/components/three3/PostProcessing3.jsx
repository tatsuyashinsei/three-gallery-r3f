// // PostProcessing3.jsx

// import { useThree, extend } from "@react-three/fiber";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
// import { useEffect, useRef } from "react";
// import * as THREE from "three";

// extend({ EffectComposer, RenderPass, UnrealBloomPass });

// export default function PostProcessing3() {
//   const { gl, scene, camera, size } = useThree();
//   const composer = useRef();

//   useEffect(() => {
//     composer.current = new EffectComposer(gl);
//     composer.current.addPass(new RenderPass(scene, camera));
//     composer.current.addPass(
//       new UnrealBloomPass(
//         new THREE.Vector2(size.width, size.height),
//         0.9, // 💡 Bloom強度を抑える
//         0.2, // 💡 Bloomの広がりを控えめに
//         12.9 // 💡 明るい部分だけに限定
//       )
//     );
//   }, [gl, scene, camera, size]);

//   useEffect(() => {
//     const handle = gl.setAnimationLoop(() => {
//       composer.current?.render();
//     });
//     return () => gl.setAnimationLoop(null);
//   }, [gl]);

//   return null;
// }
