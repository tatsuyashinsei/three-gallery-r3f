// Controls3.jsx


// ※不要ファイル？


import { useEffect, useRef } from "react";
import { Pane } from "tweakpane";
import { useGuiStore } from "@/store/useGuiStore";

export default function Controls3() {
  const { beamVisible, setBeamVisible } = useGuiStore();
  const paneRef = useRef(null);

  useEffect(() => {
    // Pane のインスタンスは1つだけ作成
    if (paneRef.current) return;
    const pane = new Pane({ title: "GUI", expanded: false });
    paneRef.current = pane;

    const params = { beamVisible };

    const input = pane.addInput(params, "beamVisible", { label: "Beam" });

    input.on("change", (ev) => {
      setBeamVisible(ev.value);
    });

    return () => {
      pane.dispose();
      paneRef.current = null;
    };
  }, []);

  return null;
}
