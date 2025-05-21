// src/pages/GalleryCanvas4.jsx

import { useState, useEffect, useRef } from "react";
import LoaderOverlay from "../components/LoaderOverlay";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { Pane } from "tweakpane";
import "../main.css";

/**
 * -------------------------------------------------------------
 *  GalleryCanvas4
 *    - Three.js + Tweakpane を “1 ファイル” にまとめた実装
 *    - 依存：three, tweakpane
 * -------------------------------------------------------------
 */
const GalleryCanvas4 = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /* -------------------------------------------------- Faze 1
       基本セットアップ（シーン・カメラ・レンダラ）
    -------------------------------------------------- */
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_, l, t) => setProgress(Math.floor((l / t) * 100));
    manager.onLoad = () => setIsLoading(false);
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(-180, 5, -50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.0; // ease-in 用の初期値
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ライト
    const directionallight = new THREE.DirectionalLight(0xebfeff, Math.PI * 2);
    directionallight.position.set(-12, 0.1, 1);
    scene.add(directionallight);

    const ambientLight = new THREE.AmbientLight(0xebfeff, Math.PI / 16);
    scene.add(ambientLight);

    const loader = new THREE.TextureLoader(manager);

    /* --------------------- 環境 HDR --------------------- */
    let environmentTexture = null;
    const loadHDR = (url) => {
      loader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromEquirectangular(texture).texture;
        environmentTexture = envMap;
        if (guiData.environment) scene.environment = envMap;
        if (guiData.background) scene.background = envMap;
        texture.dispose();
        pmrem.dispose();
      });
    };
    const defaultHDR =
      "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg";
    loadHDR(defaultHDR);

    /* --------------------- 床（表・裏） --------------------- */
    const texture1 = loader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/YakinikuIchiban.jpg",
      (t) => (t.colorSpace = THREE.SRGBColorSpace)
    );
    const texture2 = loader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/pngAsTexture@main/NishiokaAndSakura2.jpg",
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        t.repeat.x = -1;
      }
    );

    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial1 = new THREE.MeshPhysicalMaterial({
      side: THREE.FrontSide,
      map: texture1,
    });
    const floorMaterial2 = new THREE.MeshPhysicalMaterial({
      side: THREE.BackSide,
      map: texture2,
    });

    const floor1 = new THREE.Mesh(floorGeometry, floorMaterial1);
    const floor2 = new THREE.Mesh(floorGeometry, floorMaterial2);
    floor1.name = "floor1";
    floor2.name = "floor2";
    floor1.visible = floor2.visible = false;
    scene.add(floor1, floor2);

    /* -------------------------------------------------- Faze 2
       GLB モデル読み込み
    -------------------------------------------------- */
    const modelData = {
      rotationY: Math.PI / 2.35,
      scale: 5,
      posY: -2,
      emissiveIntensity: 9.5,
      transmission: 0.0,
      opacity: 1.0,
      clearcoat: 0.0,
      iridescence: 0.0,
      roughness: 1.0,
      metalness: 0.0,
      thickness: 1.0,
      ior: 1.5,
    };
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"
    );
    const gltfLoader = new GLTFLoader(manager);
    gltfLoader.setDRACOLoader(dracoLoader);

    let modelRef = null;
    gltfLoader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/gltf@main/IchibanboshiModeling5comp.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRef = model;

        // 基本変形
        model.rotation.set(0, modelData.rotationY, 0);
        model.position.set(-140, modelData.posY, -38.9);
        model.scale.setScalar(modelData.scale);

        // 星のマテリアル
        model.traverse((child) => {
          if (child.isMesh && child.name === "Cone_Color_0") {
            child.material.emissive = new THREE.Color(0xffff00);
            child.material.emissiveIntensity = modelData.emissiveIntensity;
          } else if (child.isMesh && child.material?.isMeshPhysicalMaterial) {
            Object.assign(child.material, {
              roughness: modelData.roughness,
              metalness: modelData.metalness,
              clearcoat: modelData.clearcoat,
              iridescence: modelData.iridescence,
              transmission: modelData.transmission,
              opacity: modelData.opacity,
              transparent: modelData.opacity < 1.0,
              thickness: modelData.thickness,
              ior: modelData.ior,
            });
          }
        });

        scene.add(model);
        camera.lookAt(model.position);

        // 床の位置合わせ
        floor1.position
          .copy(model.position)
          .add(new THREE.Vector3(7, -9, 2.25));
        floor1.rotation.set(0, -Math.PI / 1.69, 0);
        floor2.position.copy(floor1.position);
        floor2.rotation.copy(floor1.rotation);
        floor1.scale.setScalar(4);
        floor2.scale.copy(floor1.scale);

        // 初期表示
        applyPlaneVisibility();
      }
    );

    /* -------------------------------------------------- Faze 3
       GUI (Tweakpane)
    -------------------------------------------------- */

    // Faze 4-1 環境設定

    const guiData = {
      environment: true,
      background: true,
      planeVisible: false,
      floor1TextureVisible: false,
      floor2TextureVisible: false,
    };
    const floorMatData = {
      envMapIntensity: 1,
      roughness: 0.5,
      metalness: 0.5,
      clearcoat: 0.0,
      iridescence: 0.0,
      transmission: 0.0,
      thickness: 1.0,
      ior: 1.5,
    };

    const pane = new Pane({ title: "設定", expanded: true });
    pane.element.style.position = "fixed"; // ← 必ず追加
    pane.element.style.top = "70px"; // 上から**px下げる
    pane.element.style.right = "10px"; // 上から**px下げる

    const tpEnv = pane.addFolder({ title: "▼ 環境設定", expanded: false });

    const applyPlaneVisibility = () => {
      floor1.visible = floor2.visible = guiData.planeVisible;
      floor1.material.map = guiData.floor1TextureVisible ? texture1 : null;
      floor2.material.map = guiData.floor2TextureVisible ? texture2 : null;
      floor1.material.needsUpdate = floor2.material.needsUpdate = true;
    };

    tpEnv
      .addInput(guiData, "environment", { label: "環境反射" })
      .on("change", (ev) => {
        scene.environment = ev.value ? environmentTexture : null;
        directionallight.visible = ambientLight.visible = !ev.value;
      });

    tpEnv
      .addInput(guiData, "background", { label: "背景表示" })
      .on("change", (ev) => {
        scene.background = ev.value ? environmentTexture : null;
        particleSystem.visible = !ev.value;
        particleSystem.position.copy(camera.position);
      });

    tpEnv
      .addInput(guiData, "planeVisible", { label: "プレートを表示" })
      .on("change", () => {
        applyPlaneVisibility();
      });

    tpEnv
      .addInput(guiData, "floor1TextureVisible", { label: "プレート画像(表)" })
      .on("change", () => {
        applyPlaneVisibility();
      });
    tpEnv
      .addInput(guiData, "floor2TextureVisible", { label: "プレート画像(裏)" })
      .on("change", () => {
        applyPlaneVisibility();
      });

    const envOptions = {
      current: "デフォルト",
      mapList: {
        選択してくださいーー:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg",
        いちばん星前:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg",
        グリコ:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi.jpg",
        阿倍野ハルカス:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas.jpg",
      },
    };

    tpEnv
      .addInput(envOptions, "current", {
        label: "背景を選択",
        options: Object.keys(envOptions.mapList).map((k) => ({
          text: k,
          value: k,
        })),
      })
      .on("change", (ev) => loadHDR(envOptions.mapList[ev.value]));

    tpEnv.expanded = false;

    /* --------- プレート材質調整 ---------- */ // Faze 3-2
    const tpFloor = pane.addFolder({
      title: "▼ プレート調整",
      expanded: false,
    });
    const floorRot = { y: floor1.rotation.y };
    tpFloor
      .addInput(floorRot, "y", {
        label: "横回転",
        min: -8.154,
        max: 7.573,
        step: 0.001,
      })
      .on("change", (ev) => {
        floor1.rotation.y = floor2.rotation.y = ev.value;
      });

    const floorPos = { y: floor1.position.y };
    tpFloor
      .addInput(floorPos, "y", {
        label: "上下移動",
        min: -60,
        max: 80,
        step: 0.1,
      })
      .on("change", (ev) => {
        floor1.position.y = floor2.position.y = ev.value;
      });

    const updateFloorMaterial = (key, value) => {
      [floor1, floor2].forEach((mesh) => {
        mesh.material[key] = value;
        mesh.material.needsUpdate = true;
      });
    };
    [
      { key: "envMapIntensity", label: "環境強度", min: 0, max: 1 },
      { key: "roughness", label: "目の粗さ", min: 0, max: 1 },
      { key: "metalness", label: "金属性", min: 0, max: 1 },
      { key: "clearcoat", label: "クリアコート", min: 0, max: 1 },
      { key: "iridescence", label: "玉虫色", min: 0, max: 1 },
      { key: "transmission", label: "透過率", min: 0, max: 1 },
      { key: "thickness", label: "厚み", min: 0, max: 20 },
      { key: "ior", label: "屈折率", min: 1, max: 5 },
    ].forEach(({ key, label, min, max }) => {
      tpFloor
        .addInput(floorMatData, key, { label, min, max, step: 0.01 })
        .on("change", (ev) => updateFloorMaterial(key, ev.value));
    });

    tpFloor.expanded = false;

    /* --------- モデル材質調整 ---------- */ // Faze 3-3
    const tpModel = pane.addFolder({ title: "▼ モデル設定", expanded: false });
    tpModel
      .addInput(modelData, "rotationY", {
        label: "横回転",
        min: 0,
        max: Math.PI * 2,
        step: 0.01,
      })
      .on("change", (ev) => {
        if (modelRef) modelRef.rotation.y = ev.value;
      });

    tpModel
      .addInput(modelData, "scale", {
        label: "大きさ",
        min: 0.1,
        max: 20,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (modelRef) modelRef.scale.setScalar(ev.value);
      });

    tpModel
      .addInput(modelData, "posY", {
        label: "上下移動",
        min: -70,
        max: 70,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (modelRef) modelRef.position.y = ev.value;
      });

    tpModel
      .addInput(modelData, "emissiveIntensity", {
        label: "星の光量",
        min: 0,
        max: 20,
        step: 0.1,
      })
      .on("change", (ev) => {
        if (modelRef) {
          modelRef.traverse((child) => {
            if (child.isMesh && child.name === "Cone_Color_0") {
              child.material.emissiveIntensity = ev.value;
              child.material.needsUpdate = true;
            }
          });
        }
      });
    [
      { key: "roughness", label: "目の粗さ", min: 0, max: 1 },
      { key: "metalness", label: "金属性", min: 0, max: 1 },
      { key: "clearcoat", label: "クリアコート", min: 0, max: 1 },
      { key: "iridescence", label: "玉虫色", min: 0, max: 1 },
      { key: "transmission", label: "透過率", min: 0, max: 1 },
      { key: "opacity", label: "透明度", min: 0, max: 1 },
      { key: "thickness", label: "厚み", min: 0, max: 15 },
      { key: "ior", label: "屈折率", min: 1, max: 4 },
    ].forEach(({ key, label, min, max }) => {
      tpModel
        .addInput(modelData, key, { label, min, max, step: 0.01 })
        .on("change", (ev) => {
          if (!modelRef) return;
          modelRef.traverse((child) => {
            if (
              child.isMesh &&
              child.material?.isMeshPhysicalMaterial &&
              child.name !== "Cone_Color_0"
            ) {
              child.material[key] = ev.value;
              if (key === "opacity") child.material.transparent = ev.value < 1;
              child.material.needsUpdate = true;
            }
          });
        });
    });

    tpModel.expanded = false;

    /* --------------- リセットボタン ---------------- */ // Faze 3-4

    const initialGui = JSON.parse(JSON.stringify(guiData));
    const initialModel = JSON.parse(JSON.stringify(modelData));
    const initialMat = JSON.parse(JSON.stringify(floorMatData));

    const resetAll = () => {
      Object.assign(guiData, JSON.parse(JSON.stringify(initialGui)));
      Object.assign(modelData, JSON.parse(JSON.stringify(initialModel)));
      Object.assign(floorMatData, JSON.parse(JSON.stringify(initialMat)));
      applyPlaneVisibility();
      if (modelRef) {
        modelRef.rotation.y = modelData.rotationY;
        modelRef.scale.setScalar(modelData.scale);
        modelRef.position.y = modelData.posY;
        modelRef.traverse((child) => {
          if (child.isMesh && child.name === "Cone_Color_0") {
            child.material.emissiveIntensity = modelData.emissiveIntensity;
          } else if (child.isMesh && child.material?.isMeshPhysicalMaterial) {
            Object.keys(modelData).forEach((k) => {
              if (k in child.material) child.material[k] = modelData[k];
            });
            child.material.transparent = modelData.opacity < 1;
            child.material.needsUpdate = true;
          }
        });
      }
      Object.entries(floorMatData).forEach(([k, v]) =>
        updateFloorMaterial(k, v)
      );
      pane.refresh();
    };
    pane.addButton({ title: "🔄設定初期化" }).on("click", resetAll);

    /* -------------------------------------------------- Faze 4
       パーティクル & アニメーション
    -------------------------------------------------- */
    // 球体パーティクル
    const particleCount = 800,
      radius = 250;
    const positions = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.pow(Math.random(), 0.5);
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    const particleTexture = loader.load(
      "https://cdn.jsdelivr.net/gh/threejsconf/pngs@main/ParticleDotsImage0001.png"
    );
    const particlesMat = new THREE.PointsMaterial({
      map: particleTexture,
      color: new THREE.Color("#ffffcc"),
      size: 5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particlesGeom, particlesMat);
    particleSystem.visible = false;
    scene.add(particleSystem);

    // トーンマッピング（ease-in）
    const exposureStartTime = performance.now();
    const exposureDuration = 14000;
    const exposureTarget = 0.3;
    const easeOutQuad = (t) => t * t;

    /* ----------------- ループ & リサイズ ----------------- */
    const animate = () => {
      const elapsed = performance.now() - exposureStartTime;
      if (elapsed < exposureDuration) {
        renderer.toneMappingExposure = THREE.MathUtils.lerp(
          0,
          exposureTarget,
          easeOutQuad(elapsed / exposureDuration)
        );
      } else {
        renderer.toneMappingExposure = exposureTarget;
      }

      if (particleSystem.visible) particleSystem.rotation.y += 0.001;
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    /* -------------------------------------------------- クリーンアップ
       アンマウント時にリソースを解放
    -------------------------------------------------- */
    return () => {
      window.removeEventListener("resize", handleResize);
      pane.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      // 必要に応じてテクスチャやジオメトリを手動 dispose してください
    };
  }, []);

  /* ---------- JSX ---------- */
  return (
    <div className="h-full w-full relative" ref={containerRef}>
      {isLoading && <LoaderOverlay progress={progress} />}
    </div>
  );
};

export default GalleryCanvas4;
