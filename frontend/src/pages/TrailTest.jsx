import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import trailVertex from "../shaders/trailVertex.glsl?raw";
import trailFragment from "../shaders/trailFragment.glsl?raw";

const TrailTest = () => {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    // trail の準備
    const trailCount = 100;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailOffsets = new Float32Array(trailCount);

    for (let i = 0; i < trailCount; i++) {
      trailPositions.set([0, 0, 0], i * 3);
      trailOffsets[i] = i / trailCount;
    }

    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3),
    );
    trailGeometry.setAttribute(
      "aOffset",
      new THREE.BufferAttribute(trailOffsets, 1),
    );

    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    const trail = new THREE.Points(trailGeometry, trailMaterial);
    trail.material.size = 10;
    scene.add(trail);

    const prevAngle = { value: controls.getAzimuthalAngle() };
    const offset = new THREE.Vector3();

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      const currentAngle = controls.getAzimuthalAngle();
      const delta = currentAngle - prevAngle.value;
      prevAngle.value = currentAngle;

      const scale = 100;
      offset.set(
        Math.sin(currentAngle + Math.PI) * delta * scale,
        0,
        Math.cos(currentAngle + Math.PI) * delta * scale,
      );

      for (let i = trailCount - 1; i > 0; i--) {
        trailPositions[i * 3 + 0] = trailPositions[(i - 1) * 3 + 0];
        trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
        trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
      }

      trailPositions[0] = offset.x;
      trailPositions[1] = offset.y;
      trailPositions[2] = offset.z;

      trailGeometry.attributes.position.needsUpdate = true;
      trailMaterial.uniforms.uTime.value += 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default TrailTest;
