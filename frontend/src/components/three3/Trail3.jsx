// // Trail3.jsx

// import { useMemo, useRef } from "react";
// import { useFrame, extend } from "@react-three/fiber";
// import * as THREE from "three";
// import trailVertex from "@/shaders/trailVertex.glsl";
// import trailFragment from "@/shaders/trailFragment.glsl";

// extend({ ShaderMaterial: THREE.ShaderMaterial });

// const TRAIL_COUNT = 100;

// export default function Trail3() {
//   const mesh = useRef();
//   const { geom, mat } = useMemo(() => {
//     const positions = new Float32Array(TRAIL_COUNT * 3);
//     const offsets = new Float32Array(TRAIL_COUNT);
//     for (let i = 0; i < TRAIL_COUNT; i++) offsets[i] = i / TRAIL_COUNT;

//     const geom = new THREE.BufferGeometry();
//     geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     geom.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

//     const mat = new THREE.ShaderMaterial({
//       vertexShader: trailVertex,
//       fragmentShader: trailFragment,
//       transparent: true,
//       depthWrite: false,
//       uniforms: { uTime: { value: 0 } },
//     });

//     return { geom, mat };
//   }, []);

//   useFrame((_, delta) => {
//     mat.uniforms.uTime.value += delta;
//   });

//   return <points ref={mesh} geometry={geom} material={mat} />;
// }

export default function Trail3() {
  return null;
}
