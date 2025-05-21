// CanvasRoot1.jsx

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Lights from "./Lights"
import Helpers from "./Helpers"
import Model from "./Model"

const CanvasRoot1 = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 75 }}
      style={{ height: "100vh", background: "#1a1a1a" }}
    >
      <Lights />
      <Helpers />
      <Model />
      <OrbitControls target={[0, 2, 0]} />
    </Canvas>
  );
}

export default CanvasRoot1