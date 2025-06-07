import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import AkaiTorii from "../components/AkaiTorii";
import PictureWall from "../components/PictureWall";
import { Leva, useControls } from "leva";
import LensflareComponent from "../components/Lensflare";

const SceneContent = () => {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const targetPos = useRef(new THREE.Vector3(0, 1, 0));
  const cubeRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3(0, 1, 0));
  const floorRef = useRef();
  const cumulativeEuler = useRef(new THREE.Euler(0, 0, 0));
  const timeRef = useRef(0);
  const cameraOffsetRef = useRef(new THREE.Vector3(0, 0, 0));
  const randomTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const lastChangeTimeRef = useRef(0);
  
  // スクロール関連の状態
  const scrollRef = useRef(0);
  const isLookAtActiveRef = useRef(true);
  const cameraSwayRef = useRef(new THREE.Vector3(0, 0, 0));
  const originalCameraPositionRef = useRef(new THREE.Vector3());

  // 🎛️ Leva コントロール
  const { 
    moveSpeed, 
    rotationSpeed, 
    cubeColor, 
    restitution, 
    swayAmount, 
    swaySpeed,
    cameraOffsetRange,
    cameraChangeInterval,
    cameraLagSpeed,
    scrollSensitivity,
    cameraSwayAmount,
    lookAtToggleThreshold
  } = useControls({
    moveSpeed: {
      value: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      label: "移動スピード",
    },
    rotationSpeed: {
      value: 0.04,
      min: 0,
      max: 0.1,
      step: 0.001,
      label: "回転スピード",
    },
    swayAmount: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.1,
      label: "揺れ幅",
    },
    swaySpeed: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      label: "揺れスピード",
    },
    cameraOffsetRange: {
      value: 4,
      min: 0,
      max: 15,
      step: 0.5,
      label: "カメラオフセット範囲",
    },
    cameraChangeInterval: {
      value: 3,
      min: 1,
      max: 10,
      step: 0.5,
      label: "視点変更間隔(秒)",
    },
    cameraLagSpeed: {
      value: 0.8,
      min: 0.1,
      max: 2,
      step: 0.1,
      label: "カメラ追従速度",
    },
    scrollSensitivity: {
      value: 0.01,
      min: 0.001,
      max: 0.1,
      step: 0.001,
      label: "スクロール感度",
    },
    cameraSwayAmount: {
      value: 15,
      min: 0,
      max: 50,
      step: 1,
      label: "カメラ振り幅",
    },
    lookAtToggleThreshold: {
      value: 100,
      min: 10,
      max: 500,
      step: 10,
      label: "LookAt切替閾値",
    },
    cubeColor: { value: "gold", label: "キューブ色" },
    restitution: { value: 0, min: 0, max: 2, step: 0.01, label: "反発係数" },
  });

  // 初期カメラ位置を保存
  useEffect(() => {
    originalCameraPositionRef.current.copy(camera.position);
  }, [camera]);

  useEffect(() => {
    const handleWheel = (event) => {
      scrollRef.current += event.deltaY * scrollSensitivity;
      
      // スクロール量に基づいてLookAtのオン/オフを決定
      const scrollCycle = Math.floor(Math.abs(scrollRef.current) / lookAtToggleThreshold);
      isLookAtActiveRef.current = scrollCycle % 2 === 0;
    };

    const handleDblClick = (event) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects([floorRef.current]);
      if (intersects.length > 0) {
        targetPos.current.copy(intersects[0].point);
        targetPos.current.y = 1;
      }
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches[0];
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects([floorRef.current]);
      if (intersects.length > 0) {
        targetPos.current.copy(intersects[0].point);
        targetPos.current.y = 1;
      }
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("dblclick", handleDblClick);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("dblclick", handleDblClick);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, gl, scrollSensitivity, lookAtToggleThreshold]);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      timeRef.current += delta;
      
      // キューブの位置更新
      const currentPos = cubeRef.current.translation();
      const nextPos = new THREE.Vector3().lerpVectors(
        currentPos,
        targetPos.current,
        moveSpeed,
      );
      
      nextPos.x += Math.sin(timeRef.current * swaySpeed) * swayAmount;
      cubeRef.current.setNextKinematicTranslation(nextPos);

      if (isLookAtActiveRef.current) {
        // LookAtモード：固定点を見つめる（Cubeは画面内を自由に移動）
        if (timeRef.current - lastChangeTimeRef.current > cameraChangeInterval) {
          // カメラの注視点を固定位置周辺でランダムに設定
          randomTargetRef.current.set(
            (Math.random() - 0.5) * cameraOffsetRange,
            1 + (Math.random() - 0.5) * cameraOffsetRange * 0.5,
            (Math.random() - 0.5) * cameraOffsetRange
          );
          lastChangeTimeRef.current = timeRef.current;
        }

        const microSway = new THREE.Vector3(
          Math.sin(timeRef.current * 2.3) * 0.3,
          Math.cos(timeRef.current * 1.8) * 0.2,
          Math.sin(timeRef.current * 1.5) * 0.25
        );

        cameraOffsetRef.current.lerp(
          randomTargetRef.current.clone().add(microSway), 
          delta * cameraLagSpeed
        );
        
        // 固定された注視点を見る（Cubeの位置に依存しない）
        const fixedLookAt = new THREE.Vector3(0, 1, 0).add(cameraOffsetRef.current);
        cameraTarget.current.copy(fixedLookAt);
        camera.lookAt(cameraTarget.current);
        
        // カメラ位置を徐々に元に戻す
        camera.position.lerp(originalCameraPositionRef.current, delta * 0.5);
        
      } else {
        // フリーカメラモード：カメラ自体を左右に振る + 注視点も変更
        const swayTarget = new THREE.Vector3(
          Math.sin(timeRef.current * 1.2) * cameraSwayAmount,
          Math.sin(timeRef.current * 0.8) * cameraSwayAmount * 0.3,
          Math.cos(timeRef.current * 0.9) * cameraSwayAmount * 0.5
        );
        
        cameraSwayRef.current.lerp(swayTarget, delta * 2);
        
        const newCameraPos = originalCameraPositionRef.current.clone().add(cameraSwayRef.current);
        camera.position.copy(newCameraPos);
        
        // 注視点もランダムに変更（Cubeから完全に独立）
        const randomLookTarget = new THREE.Vector3(
          Math.sin(timeRef.current * 0.4) * 20,
          Math.cos(timeRef.current * 0.3) * 10,
          Math.sin(timeRef.current * 0.5) * 15
        );
        camera.lookAt(randomLookTarget);
      }

      // キューブの回転更新
      cumulativeEuler.current.y += rotationSpeed;
      const nextQuat = new THREE.Quaternion().setFromEuler(
        cumulativeEuler.current,
      );
      cubeRef.current.setNextKinematicRotation(nextQuat);
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} fade />

      {/* 太陽 */}
      {/* <TheSun /> */}
      <LensflareComponent position={[1.5, 12, 32]} />

      {/* 床 */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          ref={floorRef}
          rotation-x={-Math.PI / 2}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#00008b"
            metalness={1}
            roughness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      </RigidBody>

      {/* プレイヤーキューブ */}
      <RigidBody
        ref={cubeRef}
        type="kinematicPosition"
        colliders="cuboid"
        friction={0.2}
        restitution={0}
      >
        <mesh castShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={cubeColor}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      </RigidBody>

      {/* 鳥居モデル（restitution を各 AkaiTorii に渡す） */}
      <AkaiTorii
        position={[-5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[-10, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[-15, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[-5, 0, -20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[5, 0, -20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii position={[20, 0, 0]} restitution={restitution} />
      <AkaiTorii
        position={[-15, 0, -15]}
        rotation={[0, Math.PI / -4, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[15, 0, -15]}
        rotation={[0, Math.PI / 4, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[19, 0, -7.5]}
        rotation={[0, Math.PI / 5, 0]}
        restitution={restitution}
      />
      <AkaiTorii position={[-20, 0, -5]} restitution={restitution} />
      <AkaiTorii position={[20, 0, 5]} restitution={restitution} />
      <AkaiTorii position={[20, 0, 10]} restitution={restitution} />
      <AkaiTorii position={[20, 0, 15]} restitution={restitution} />

      <AkaiTorii
        position={[18.5, 0, 18.5]}
        rotation={[0, Math.PI / -4, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[15, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[10, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[5, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[0, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[-5, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />
      <AkaiTorii
        position={[-10, 0, 20]}
        rotation={[0, Math.PI / 2, 0]}
        restitution={restitution}
      />

      <PictureWall position={[-20, 3.000001, 20]} />

      <RigidBody
        type="dynamic"
        colliders="cuboid"
        mass={5}
        friction={0.5}
        restitution={0.2}
      >
        <mesh position={[-20, 1.4500001, 20]}>
          <boxGeometry args={[8, 3, 8]} />
          <meshStandardMaterial color="gray" metalness={0.5} roughness={0.5} />
        </mesh>
      </RigidBody>

      <gridHelper args={[50, 10, "red", "pink"]} position={[0, 0.01, 0]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, -7.5]}
        intensity={12}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <OrbitControls />
    </>
  );
};

const GalleryCanvas2 = () => (
  <>
    <Canvas
      shadows
      camera={{ position: [5, 5, 10], fov: 75 }}
      style={{ width: "100vw", height: "100vh", background: "black" }}
    >
      <Physics>
        <SceneContent />
      </Physics>
    </Canvas>
    <div className="leva-wrapper">
      <Leva collapsed={true} />
    </div>
  </>
);

export default GalleryCanvas2;
