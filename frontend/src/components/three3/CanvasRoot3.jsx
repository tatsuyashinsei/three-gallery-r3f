// CanvasRoot3.jsx

import { Canvas } from "@react-three/fiber";
import SceneContent3 from "./SceneContent3";
import GuiPanelRoot from "./GuiPanelRoot";

export default function CanvasRoot3() {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{ position: [-180, 5, -50], fov: 75 }}
      style={{ width: "100%", height: "100vh", background: "black" }}
    >
      {/* シーンの描画要素 */}
      <SceneContent3 />

      {/* GUIパネルと制御系（createBeamなどは SceneContent 側で提供してもOK） */}
      <GuiPanelRoot />
    </Canvas>
  );
}