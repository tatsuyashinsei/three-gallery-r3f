// CometBeamComponent.jsx - React component wrapper for comet beam effects
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createCometBeamEffect, createCometBeamCluster } from "./CometBeamEffect";

export default function CometBeamComponent({
  type = "green",        // "green" or "yellow"
  mode = "single",       // "single" or "cluster"
  visible = true,
  position = new THREE.Vector3(0, 0, 0),  // 放出位置（旧start）
  direction = new THREE.Vector3(1, 0, 0), // 放出方向（旧endから計算）
  velocity = 5.0,        // パーティクル速度
  spread = 0.3,          // 放出角度の広がり
  intensity = 1.0,
  cometTailLength = 8.0,
  scatterStrength = 60.0,
  autoRotate = false,
  rotationSpeed = 0.5,
  gravity = new THREE.Vector3(0, -0.5, 0), // 重力効果
  // Cluster mode props
  beamCount = 3,
  spreadAngle = Math.PI / 6,
  colors = ["green", "yellow", "green"],
  // Lifetime props
  lifetimeRange = [2.0, 4.0],
}) {
  const { scene } = useThree();
  const groupRef = useRef(null);
  const [beamEffect, setBeamEffect] = useState(null);

  // Create the beam effect
  useEffect(() => {
    if (!visible || !scene) return;

    console.log(`[CometBeamComponent] ⚠️ 🔄 RECREATING BEAM: type=${type}, visible=${visible}`);
    console.log(`[CometBeamComponent] 📍 position:`, position.toArray());
    console.log(`[CometBeamComponent] 🧭 direction:`, direction.toArray());

    // Clean up previous effect
    if (beamEffect) {
      beamEffect.dispose();
    }

    let newBeamEffect;

    if (mode === "cluster") {
      // Create cluster of beams
      newBeamEffect = createCometBeamCluster(scene, {
        position,
        direction: direction.clone().normalize(),
        beamCount,
        spreadAngle,
        colors,
      });
    } else {
      // Create single beam
      newBeamEffect = createCometBeamEffect(scene, type, {
        position,
        direction: direction.clone().normalize(),
        velocity,
        spread,
        intensityMultiplier: intensity,
        cometTailLength,
        scatterStrength,
        lifetimeRange,
        gravity,
      });
    }

    console.log(`[CometBeamComponent] ✅ Beam effect created:`, newBeamEffect);
    setBeamEffect(newBeamEffect);

    return () => {
      if (newBeamEffect) {
        newBeamEffect.dispose();
      }
    };
  }, [
    visible,
    scene,
    type,
    mode,
    // ✅ 位置・方向の変化では再作成しない（setPositionで動的更新）
  ]);

  // ✅ 位置の動的更新（再作成なし）
  useEffect(() => {
    if (beamEffect && beamEffect.setPosition) {
      console.log(`[CometBeamComponent] 🔄 Updating position:`, position.toArray());
      beamEffect.setPosition(position);
    }
  }, [beamEffect, position.x, position.y, position.z]);

  // Animation loop
  useFrame((state) => {
    if (!beamEffect) return;

    // Update beam effect
    beamEffect.update(state.clock.getElapsedTime());

    // Auto rotation if enabled
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (beamEffect) {
        beamEffect.dispose();
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {/* Empty group for potential future enhancements */}
    </group>
  );
}

// Preset configurations for easy use
export const CometBeamPresets = {
  // Dramatic yellow comet beam
  yellowComet: {
    type: "yellow",
    intensity: 1.5,
    velocity: 6.0,
    spread: 0.4,
    cometTailLength: 10.0,
    scatterStrength: 80.0,
    lifetimeRange: [3.0, 5.0],
  },
  
  // Bright green comet beam
  greenComet: {
    type: "green",
    intensity: 1.3,
    velocity: 5.5,
    spread: 0.3,
    cometTailLength: 8.0,
    scatterStrength: 70.0,
    lifetimeRange: [2.5, 4.5],
  },
  
  // Multi-beam cluster effect
  cometCluster: {
    mode: "cluster",
    beamCount: 5,
    spreadAngle: Math.PI / 4,
    colors: ["yellow", "green", "yellow", "green", "yellow"],
    intensity: 0.8,
    velocity: 4.0,
  },
  
  // Subtle comet trail
  subtleComet: {
    type: "green",
    intensity: 0.6,
    velocity: 3.0,
    spread: 0.2,
    cometTailLength: 5.0,
    scatterStrength: 40.0,
    lifetimeRange: [1.5, 3.0],
  },
};

// Utility function to create multiple comet beams easily
export function createMultipleCometBeams(beamConfigs) {
  return beamConfigs.map((config, index) => (
    <CometBeamComponent
      key={index}
      {...config}
    />
  ));
} 