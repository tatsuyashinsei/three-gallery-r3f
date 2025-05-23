// Env3Controllers/BackgroundController.jsx
import { useEffect } from "react";
import { Stars } from "@react-three/drei";

export default function BackgroundController({ backgroundEnabled }) {
  if (backgroundEnabled) return null;

  return (
    <Stars radius={100} depth={50} count={5000} factor={4} fade speed={0.5} />
  );
}
