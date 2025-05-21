import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createBeamEffect } from "../components/BeamEffect";

const ShaderTest = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    camera.position.set(-140, -2, -38.9);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // OrbitControls の追加
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 光源
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);

    // 中心の球体
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: "white" })
    );
    scene.add(sphere);

    // ビームの原点位置
    const beamOrigin = new THREE.Vector3(0, 0, 0);

    // オレンジビーム
    const orangeBeam = createBeamEffect(scene, "orange", {
      position: beamOrigin,
      lengthFactor: 10,
      yOffset: 0.0,
      directionOffset: new THREE.Vector3(0.0, -0.1, 0.275),
      // ********************* この数値を参照（歪み対策）***********************
    });

    // 緑ビーム
    const greenBeam = createBeamEffect(scene, "green", {
      position: beamOrigin,
      lengthFactor: 10,
      yOffset: 0.0,
      directionOffset: new THREE.Vector3(0.0, -0.1, 0.275),
      // ********************* この数値を参照（歪み対策）**********************
    });

    camera.lookAt(sphere.position);

    const startTime = performance.now();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;

      orangeBeam.update(elapsed);
      greenBeam.update(elapsed);

      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      orangeBeam.dispose();
      greenBeam.dispose();
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ShaderTest;
