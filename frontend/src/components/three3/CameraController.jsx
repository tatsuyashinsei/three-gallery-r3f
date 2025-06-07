import { useRef, useImperativeHandle, forwardRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const INITIAL_CAMERA_POSITION = [-180, 5, -50];
const INITIAL_TARGET = [0, 0, 0];

const CameraController = forwardRef((props, ref) => {
  const controlsRef = useRef();
  const { camera } = useThree();

  // リセット機能を公開
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log("🔄 [CameraController] カメラリセット実行");
      
      // カメラ位置をリセット
      camera.position.set(...INITIAL_CAMERA_POSITION);
      
      // OrbitControlsのターゲットをリセット
      if (controlsRef.current) {
        controlsRef.current.target.set(...INITIAL_TARGET);
        controlsRef.current.update();
      }
      
      console.log("✅ [CameraController] カメラリセット完了");
    }
  }));

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      target={INITIAL_TARGET}
    />
  );
});

CameraController.displayName = 'CameraController';

export default CameraController; 