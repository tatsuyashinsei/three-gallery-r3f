// CanvasRoot3.jsx

import { Canvas } from "@react-three/fiber";
import SceneContent3 from "./SceneContent3";
import GuiPanel3 from "./GuiPanel3";

export default function CanvasRoot3() {
  return (
    <>
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [-180, 5, -50], fov: 75, near: 0.001, far: 100000 }}
        style={{ width: "100%", height: "100vh", background: "black" }}
      >
        <color attach="background" args={["#000"]} />
        <SceneContent3 />
      </Canvas>
      {/* GUI パネルは DOM レイヤーで */}
      <GuiPanel3 />
    </>
  );
}
