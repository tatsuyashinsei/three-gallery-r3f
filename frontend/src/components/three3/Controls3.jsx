// Controls3.jsx

import { useEffect } from "react";
import { Pane } from "tweakpane";
import { useGuiStore } from "@/store/useGuiStore";
// import { useGuiStore } from "../../store/useGuiStore";

export default function GuiPanel3() {
  const { beamVisible, toggleBeam } = useGuiStore();

  useEffect(() => {
    const pane = new Pane({ title: "GUI", expanded: false });
    pane
      .addInput({ beamVisible }, "beamVisible", { label: "Beam" })
      .on("change", () => toggleBeam());
    return () => pane.dispose();
  }, [beamVisible, toggleBeam]);

  return null;
}