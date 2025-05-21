// // pages/GalleryCanvas1.jsx
// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useHelper } from "@react-three/drei";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// const ModelWithRaycast = () => {
//   const gltf = useGLTF(
//     "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/elf.glb",
//   );
//   const { camera, gl } = useThree();
//   const raycaster = useRef(new THREE.Raycaster());
//   const mouse = useRef(new THREE.Vector2());
//   const [pickables, setPickables] = useState([]);

//   // モデル読み込み → pickablesに格納
//   useEffect(() => {
//     const meshes = [];
//     gltf.scene.traverse((child) => {
//       if (child.isMesh) meshes.push(child);
//     });
//     setPickables(meshes);
//   }, [gltf]);

//   // マウス座標取得 + Raycasting
//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       const { clientX, clientY } = event;
//       const { width, height } = gl.domElement.getBoundingClientRect();

//       mouse.current.x = (clientX / width) * 2 - 1;
//       mouse.current.y = -(clientY / height) * 2 + 1;

//       raycaster.current.setFromCamera(mouse.current, camera);

//       const intersects = raycaster.current.intersectObjects(pickables, false);
//       if (intersects.length) {
//         console.log("---- 検出 ----");
//         console.log("位置情報：", intersects[0].point);
//         console.log("モデル名：", intersects[0].object.name);
//         console.log("カメラからの距離：", intersects[0].distance);
//         console.log("法線方向：", intersects[0].face.normal);
//         console.log("--------------");
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [camera, gl, pickables]);

//   return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />;
// };

// const Lights = () => (
//   <>
//     <ambientLight intensity={2} />
//     <directionalLight color="red" intensity={5.5} position={[2, -4, 0]} />
//     <directionalLight color="blue" intensity={5.5} position={[-2, -4, 0]} />
//     <directionalLight color="pink" intensity={3} position={[0, 1, 2]} />
//     <directionalLight color="yellow" intensity={1.0} position={[0, 0, -2]} />
//   </>
// );

// const Helpers = () => {
//   const boxRef = useRef();
//   useHelper(boxRef, THREE.BoxHelper, "blue");

//   return (
//     <>
//       <primitive object={new THREE.GridHelper(10, 10)} />
//       <mesh ref={boxRef}>
//         <boxGeometry args={[10, 10, 10]} />
//         <meshBasicMaterial wireframe />
//       </mesh>
//     </>
//   );
// };

// const GalleryCanvas1 = () => (
//   <div className="w-full h-full bg-black">
//     {" "}
//     {/* ← ラッパー追加 */}
//     <Canvas camera={{ position: [0, 2, 5], fov: 75 }} className="w-full h-full">
//       <Lights />
//       <Helpers />
//       <ModelWithRaycast />
//       <OrbitControls target={[0, 2, 0]} />
//     </Canvas>
//   </div>
// );

// export default GalleryCanvas1;
