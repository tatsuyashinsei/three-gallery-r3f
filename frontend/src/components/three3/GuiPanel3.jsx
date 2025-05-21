// GuiPanel3.jsx

import { useEffect } from "react";
import { Pane } from "tweakpane";
import useGuiStore from "@/store/useGuiStore"; // ✅ default import に修正

export default function GuiPanel3() {
  const {
    beamVisible,
    environment,
    planeVisible,
    toggleBeam,
    toggleEnv,
    togglePlane,
  } = useGuiStore();

  useEffect(() => {
    const pane = new Pane({ title: "GUI", expanded: false });
    pane
      .addInput({ beamVisible }, "beamVisible", { label: "Beam" })
      .on("change", () => toggleBeam());
    pane
      .addInput({ environment }, "environment", { label: "Environment" })
      .on("change", () => toggleEnv());
    pane
      .addInput({ planeVisible }, "planeVisible", { label: "Floor" })
      .on("change", () => togglePlane());
    return () => pane.dispose();
  }, [
    beamVisible,
    environment,
    planeVisible,
    toggleBeam,
    toggleEnv,
    togglePlane,
  ]);

  return null;
}
