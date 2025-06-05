// CometBeamDemo.jsx - Demo page for the new comet beam effects
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import CometBeamComponent, { CometBeamPresets } from "../components/CometBeamComponent";

function SceneContent() {
  // Leva controls for real-time adjustment
  const { 
    showYellowComet, 
    showGreenComet, 
    showCometCluster,
    intensity,
    cometTailLength,
    scatterStrength,
    autoRotate 
  } = useControls("Comet Beam Effects", {
    showYellowComet: { value: true },
    showGreenComet: { value: true },
    showCometCluster: { value: false },
    intensity: { value: 1.2, min: 0.1, max: 3.0, step: 0.1 },
    cometTailLength: { value: 8.0, min: 2.0, max: 20.0, step: 0.5 },
    scatterStrength: { value: 60.0, min: 20.0, max: 120.0, step: 5.0 },
    autoRotate: { value: false },
  });

  const { beamLength, beamSpread } = useControls("Beam Geometry", {
    beamLength: { value: 8.0, min: 2.0, max: 15.0, step: 0.5 },
    beamSpread: { value: 3.0, min: 0.5, max: 8.0, step: 0.1 },
  });

  // Define beam positions and directions
  const centerPos = new THREE.Vector3(0, 0, 0);
  const yellowPosition = new THREE.Vector3(-2, 1, 0);
  const yellowDirection = new THREE.Vector3(beamLength, beamSpread, 2).normalize();
  
  const greenPosition = new THREE.Vector3(-2, -1, 0);
  const greenDirection = new THREE.Vector3(beamLength, -beamSpread, 2).normalize();

  const clusterPosition = new THREE.Vector3(0, 0, 0);
  const clusterDirection = new THREE.Vector3(beamLength, 0, 3).normalize();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Reference objects */}
      <mesh position={centerPos}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Yellow Comet Beam */}
      {showYellowComet && (
        <CometBeamComponent
          type="yellow"
          position={yellowPosition}
          direction={yellowDirection}
          velocity={6.0}
          spread={0.4}
          intensity={intensity}
          cometTailLength={cometTailLength}
          scatterStrength={scatterStrength}
          lifetimeRange={[3.0, 5.0]}
          autoRotate={autoRotate}
          rotationSpeed={0.3}
        />
      )}
      
      {/* Green Comet Beam */}
      {showGreenComet && (
        <CometBeamComponent
          type="green"
          position={greenPosition}
          direction={greenDirection}
          velocity={5.5}
          spread={0.3}
          intensity={intensity}
          cometTailLength={cometTailLength}
          scatterStrength={scatterStrength}
          lifetimeRange={[2.5, 4.5]}
          autoRotate={autoRotate}
          rotationSpeed={-0.2}
        />
      )}
      
      {/* Comet Cluster */}
      {showCometCluster && (
        <CometBeamComponent
          mode="cluster"
          position={clusterPosition}
          direction={clusterDirection}
          beamCount={5}
          spreadAngle={Math.PI / 3}
          colors={["yellow", "green", "yellow", "green", "yellow"]}
          intensity={intensity * 0.7}
          cometTailLength={cometTailLength * 0.8}
          scatterStrength={scatterStrength * 0.9}
          autoRotate={autoRotate}
          rotationSpeed={0.5}
        />
      )}
      
      <OrbitControls enableDamping makeDefault />
    </>
  );
}

function PresetButtons() {
  const applyPreset = (presetName) => {
    console.log(`Applying preset: ${presetName}`);
    // In a real implementation, you'd update the controls state here
  };

  return (
    <div style={{
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      zIndex: 1000,
    }}>
      <h3 style={{ color: "white", margin: 0 }}>Presets</h3>
      <button onClick={() => applyPreset("yellowComet")}>
        Yellow Comet
      </button>
      <button onClick={() => applyPreset("greenComet")}>
        Green Comet
      </button>
      <button onClick={() => applyPreset("cometCluster")}>
        Comet Cluster
      </button>
      <button onClick={() => applyPreset("subtleComet")}>
        Subtle Comet
      </button>
    </div>
  );
}

export default function CometBeamDemo() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Canvas
        camera={{ position: [10, 5, 10], fov: 75 }}
        style={{ background: "linear-gradient(to bottom, #001122, #000000)" }}
      >
        <SceneContent />
      </Canvas>
      
      <PresetButtons />
      
      {/* Info panel */}
      <div style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        color: "white",
        background: "rgba(0,0,0,0.7)",
        padding: "15px",
        borderRadius: "8px",
        maxWidth: "300px",
        fontSize: "14px",
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>🌟 Comet Beam Effects</h3>
        <p style={{ margin: "5px 0" }}>
          Enhanced particle system with yellow and green comet-like beams that scatter dramatically.
        </p>
        <p style={{ margin: "5px 0" }}>
          ✨ Use the controls to adjust intensity, tail length, and scatter strength.
        </p>
        <p style={{ margin: "5px 0" }}>
          🎮 Drag to orbit, scroll to zoom.
        </p>
      </div>
    </div>
  );
} 