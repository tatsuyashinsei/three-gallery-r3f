// src/pages/GalleryCanvas3.jsx

import { useState, useEffect, useRef } from "react";
import LoaderOverlay from "../components/LoaderOverlay";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { Pane } from "tweakpane";
import "../main.css";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Shaders Imports
import trailVertex from "../shaders/trailVertex.glsl";
import trailFragment from "../shaders/trailFragment.glsl";

// Shaders
// const trailCount = 100
// const trailGeometry = new THREE.BufferGeometry()
// const trailPositions = new Float32Array(trailCount * 3)
// const trailOffsets = new Float32Array(trailCount)

// BeamEffect
import { createBeamEffect } from "../components/BeamEffect"; // 
import { createBeamEffectM } from "../components/BeamEffectM"; // 

/**
 * -------------------------------------------------------------
 *  GalleryCanvas3
 *    - Three.js + Tweakpane を “1 ファイル” にまとめた実装
 *    - 依存：three, tweakpane
 * -------------------------------------------------------------
 */
const GalleryCanvas3 = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  let testLight = null; // ← useEffect の外 or 冒頭に追加

  let greenBeam, orangeBeam; // ← useEffect の外 or 冒頭に追加 ***********************************

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
      0.001,
      10000000
    );
    camera.position.set(-180, 5, -50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.0; // ease-in 用の初期値
    container.appendChild(renderer.domElement);

    // ------------------------------------
    // ------------------------------------
    // ★★★ Bloom 合成エフェクトを追加 ★★★
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      8.5, // 強度（intensity）
      0.4, // 半径（radius）
      0.95 // 閾値（threshold）
    );
    composer.addPass(bloomPass);

    // ------------------------------------
    // ------------------------------------

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // ライト
    const directionallight = new THREE.DirectionalLight(0xebfeff, Math.PI * 2);
    directionallight.position.set(-12, 0.1, 1);
    // directionallight.intensity = 3.5;
    scene.add(directionallight);

    const ambientLight = new THREE.AmbientLight(0xebfeff, Math.PI / 16);
    // ambientLight.intensity = 1.5;
    scene.add(ambientLight);

    // ------------------------------------
    // ------------------------------------
    // ★★★ Beam を追加 ★★★

    // const greenBeam = createBeamEffect(scene, "green");
    // const orangeBeam = createBeamEffect(scene, "orange", {  //******************************* */
    //   yOffset: 0.25,
    //   lengthFactor: 10,
    // });

    // ------------------------------------
    // ------------------------------------

    const loader = new THREE.TextureLoader(manager);

    /* -------------------------------------------------- Shader Faze 
    シェーダーによる trail エフェクトの初期化
    -------------------------------------------------- */

    // trail の数（ポイント数）
    const trailCount = 100;

    // trail の頂点座標とオフセットを定義
    const trailPositions = new Float32Array(trailCount * 3);
    const trailOffsets = new Float32Array(trailCount);

    for (let i = 0; i < trailCount; i++) {
      trailPositions.set([0, 0, 0], i * 3);
      trailOffsets[i] = i / trailCount;
    }

    // trail のジオメトリ
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(trailPositions, 3)
    );
    trailGeometry.setAttribute(
      "aOffset",
      new THREE.BufferAttribute(trailOffsets, 1)
    );

    // trail のマテリアル（シェーダー使用）
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertex,
      fragmentShader: trailFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
      },
    });

    //  // ------------------------------------
    //     // ------------------------------------
    //     // ShaderMaterial のデバッグ調整
    //         const trailMaterial = new THREE.ShaderMaterial({
    //           vertexShader: trailVertex,
    //           fragmentShader: trailFragment,
    //           transparent: false,   // 一時的に false に
    //           depthWrite: true,     // 一時的に true に
    //           uniforms: {
    //             uTime: { value: 0 }
    //           }
    //         })

    //     // ------------------------------------
    //     // ------------------------------------

    // trail メッシュとしてシーンに追加
    const trailMesh = new THREE.Points(trailGeometry, trailMaterial);
    trailMesh.material.size = 80; // 大きくする
    trailMesh.material.color = new THREE.Color("red"); // 目立たせる
    trailMaterial.uniforms.uTime.value += 0.05; // ← やや速めて揺れが視認できるように

    scene.add(trailMesh);

    // ------------------------------------
    // trail アニメーション用の補助ベクトル類
    // （animate() で使用）
    // ------------------------------------
    const prevAzimuthalAngle = { value: controls.getAzimuthalAngle() };
    const trailOffset = new THREE.Vector3();
    const modelPos = new THREE.Vector3();
    const trailPos = new THREE.Vector3();

    /* --------------------- 環境 HDR --------------------- */

    let environmentTexture = null;

    // ------------------------------------
    // スマホ判定 + GUI初期値セット
    // (実装保留中)
    // ------------------------------------

    /**
     * Equirectangular JPG/HDR を読み込み、
     * PMREM で環境マップに変換して scene に適用する関数
     */
    const loadHDR = (url) => {
      loader.load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;

          const pmrem = new THREE.PMREMGenerator(renderer);
          const envMap = pmrem.fromEquirectangular(texture).texture;

          environmentTexture = envMap;
          if (guiData.environment) scene.environment = envMap;
          if (guiData.background) scene.background = envMap;

          texture.dispose();
          pmrem.dispose();
        },
        undefined,
        (err) => console.error("HDR テクスチャの読み込みに失敗:", err)
      );
    };

    /* --- 端末がモバイルかどうかを判定して HDR を切り替え --- */
    const isMobile = /iPhone|iPad|Android.+Mobile/.test(navigator.userAgent);

    const createBeam = isMobile ? createBeamEffectM : createBeamEffect;
    //------------------------------------+++++++++++++++++++++++++++++

    /* let にして再代入できるようにする（重複宣言を防ぐ） */
    let defaultHDR = isMobile
      ? "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg" // ★ 軽量版
      : "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg"; // ★ 高画質版

    /* 初期ロード */
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
    /* -------------------------------------------------- Faze 2
   GLB モデル読み込み
-------------------------------------------------- */
    const modelData = {
      rotationY: Math.PI / 2.35,
      scale: 5,
      posY: -2,
      emissiveIntensity: 19.7,
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

        // 星の位置を取得してビームの原点に使う
        let conePos = new THREE.Vector3();
        model.traverse((child) => {
          if (child.isMesh && child.name === "Cone_Color_0") {
            child.getWorldPosition(conePos);
          }
        });

        // ✅ beamVisible フラグが true のときだけビームを描写
        if (guiData.beamVisible) {
          greenBeam = createBeam(scene, "green", {
            position: conePos,
            lengthFactor: 10,
            yOffset: 0.0,
          });

          orangeBeam = createBeam(scene, "orange", {
            position: conePos,
            lengthFactor: 10,
            yOffset: 0.2,
          });
        }

        camera.lookAt(model.position);

        // テストライト
        const testLight = new THREE.PointLight(0xffee88, 500, 1000);
        testLight.intensity = 8;
        testLight.decay = 20;
        testLight.distance = 80;
        scene.add(testLight);
        testLight.position
          .copy(model.position)
          .add(new THREE.Vector3(1, 8, 0.19));

        // 床の位置合わせ
        floor1.position
          .copy(model.position)
          .add(new THREE.Vector3(7, -9, 2.25));
        floor1.rotation.set(0, -Math.PI / 1.69, 0);
        floor2.position.copy(floor1.position);
        floor2.rotation.copy(floor1.rotation);
        floor1.scale.setScalar(4);
        floor2.scale.copy(floor1.scale);

        // 初期表示反映
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
      beamVisible: false, // ← 追加
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

    tpEnv
      .addInput(guiData, "beamVisible", { label: "ほうき星表示" })
      .on("change", (ev) => {
        if (greenBeam) greenBeam.dispose();
        if (orangeBeam) orangeBeam.dispose();

        if (ev.value && modelRef) {
          // beam 再生成（conePos を再取得してから）
          let conePos = new THREE.Vector3();
          modelRef.traverse((child) => {
            if (child.isMesh && child.name === "Cone_Color_0") {
              child.getWorldPosition(conePos);
            }
          });

          greenBeam = createBeam(scene, "green", { position: conePos });
          orangeBeam = createBeam(scene, "orange", { position: conePos });
        }
      });

    const envOptions = {
      current: "デフォルト",
      mapList: {
        選択してくださいーー:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
        いちばん星前・低画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
        いちばん星前・中画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mid.jpg",
        いちばん星前・高画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_high.jpg",
        いちばん星前激重スマホ不可:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg",
        グリコ・低画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_small.jpg",
        グリコ・中画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mid.jpg",
        グリコ・高画質スマホ熱々:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_high.jpg",
        グリコ激重ブラウザ終了:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi.jpg",
        阿倍野ハルカス・中画質:
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_mid.jpg",
        阿倍野ハルカスメモリ飛ぶ:
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

    const textNote = { note: "📱 おすすめ設定:\n目の粗さ: 0.1\n金属性: 1.0" };

    tpModel.addMonitor(textNote, "note", {
      multiline: true,
      lineCount: 3, // 表示行数（必要に応じて調整）
      label: "補足情報",
    });

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
        min: 1,
        max: 30,
        step: 0.1,
      })
      .on("change", (ev) => {
        const intensity = ev.value;

        // 星のマテリアルに反映
        if (modelRef) {
          modelRef.traverse((child) => {
            if (child.isMesh && child.name === "Cone_Color_0") {
              child.material.emissiveIntensity = intensity;
              child.material.needsUpdate = true;
            }
          });
        }

        // 🌟 テストライトに連動させる
        if (testLight) {
          testLight.intensity = intensity;
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

    // 初期状態を記録（useEffect の前半で定義されているものと一致させること）
    const initialGui = JSON.parse(JSON.stringify(guiData));
    const initialModel = JSON.parse(JSON.stringify(modelData));
    const initialMat = JSON.parse(JSON.stringify(floorMatData));
    const initialCamPos = camera.position.clone();
    const initialCamTarget = controls.target.clone();

    // リセット関数
    const resetAll = () => {
      // GUI・モデル・床マテリアルの状態を初期値に戻す
      Object.assign(guiData, JSON.parse(JSON.stringify(initialGui)));
      Object.assign(modelData, JSON.parse(JSON.stringify(initialModel)));
      Object.assign(floorMatData, JSON.parse(JSON.stringify(initialMat)));
      applyPlaneVisibility();

      // モデルの状態を初期化
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

      // 床マテリアルの更新
      Object.entries(floorMatData).forEach(([k, v]) => {
        updateFloorMaterial(k, v);
      });

      // ✅ カメラ位置・向きをリセット
      camera.position.copy(initialCamPos);
      controls.target.copy(initialCamTarget);
      controls.update();

      // パネルの状態をリフレッシュ
      pane.refresh();
    };

    // ボタン追加
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

    // ✅ 背景用の超巨大パーティクル球体
    const superParticleCount = 1000;
    const superRadius = 500000;
    const superPositions = [];

    for (let i = 0; i < superParticleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = superRadius * Math.sqrt(Math.random());
      superPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }

    const superGeom = new THREE.BufferGeometry();
    superGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(superPositions, 3)
    );

    const superMat = new THREE.PointsMaterial({
      map: particleTexture,
      color: new THREE.Color("#ddeeff"),
      size: 10,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.12,
      alphaTest: 0.01,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const superParticleSystem = new THREE.Points(superGeom, superMat);
    superParticleSystem.visible = true; // 常に表示
    scene.add(superParticleSystem);

    const animate = () => {
      // ***************** animate ******************************************
      requestAnimationFrame(animate);

      // トーンマッピングのイーズイン処理
      const elapsed = performance.now() - exposureStartTime;

      const elapsedSec = performance.now() / 1000;
      if (greenBeam) greenBeam.update(elapsed / 1000); // 秒に直す
      if (orangeBeam) orangeBeam.update(elapsed / 1000); // *****************************************

      if (elapsed < exposureDuration) {
        renderer.toneMappingExposure = THREE.MathUtils.lerp(
          0,
          exposureTarget,
          easeOutQuad(elapsed / exposureDuration)
        );
      } else {
        renderer.toneMappingExposure = exposureTarget;
      }

      // パーティクル回転（背景用）
      if (particleSystem.visible) {
        particleSystem.rotation.y += 0.001;
      }
      // ********************************************************

      // const animate = () => { // ***************************************
      //   requestAnimationFrame(animate);

      //   const elapsed = performance.now() - exposureStartTime;
      //   const elapsedSec = performance.now() / 1000;

      //   // ✅ ビーム開始時間からの差分だけ uTime に渡す
      //   const beamStartSec = exposureDuration / 1000;
      //   const beamTime = Math.max(0, elapsedSec - beamStartSec);
      //   if (greenBeam) greenBeam.update(beamTime);
      //   if (orangeBeam) orangeBeam.update(beamTime);

      //   if (elapsed < exposureDuration) {
      //     renderer.toneMappingExposure = THREE.MathUtils.lerp(
      //       0,
      //       exposureTarget,
      //       easeOutQuad(elapsed / exposureDuration)
      //     );
      //   } else {
      //     renderer.toneMappingExposure = exposureTarget;
      //   }

      // ここから下は trail やパーティクルなど既存のままでOKです *****************************************

      // カメラの操作更新
      controls.update();

      // ---- カメラの水平角度の差分から trail の方向ベクトルを算出 ----
      const currentAngle = controls.getAzimuthalAngle();
      const deltaAngle = currentAngle - prevAzimuthalAngle.value;
      prevAzimuthalAngle.value = currentAngle;

      const scale = 50000; // エフェクトの尾の長さ
      trailOffset.set(
        Math.sin(currentAngle + Math.PI) * deltaAngle * scale,
        0,
        Math.cos(currentAngle + Math.PI) * deltaAngle * scale
      );

      // ---- trail の各ポイントをずらす（後ろへ） ----
      for (let i = trailCount - 1; i > 0; i--) {
        trailPositions[i * 3 + 0] = trailPositions[(i - 1) * 3 + 0];
        trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
        trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
      }

      // trail の先頭ポイントを更新（モデル追従）
      if (modelRef) {
        modelPos.copy(modelRef.position);
        trailPos.copy(modelPos).add(trailOffset);

        trailPositions[0] = trailPos.x;
        trailPositions[1] = trailPos.y;
        trailPositions[2] = trailPos.z;
      }

      // GPU に trail の更新を通知
      trailGeometry.attributes.position.needsUpdate = true;

      // uTime を更新（アニメーション用途）
      trailMaterial.uniforms.uTime.value += 0.01;

      // 描画（ポストプロセス込み）
      composer.render();
    };

    animate();

    // const elapsed = clock.getElapsedTime();
    // greenBeam.update(elapsed);
    // orangeBeam.update(elapsed); // ***************************************

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);

      // ✅ composer にもリサイズを適用
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    /* -------------------------------------------------- クリーンアップ
       アンマウント時にリソースを解放
    -------------------------------------------------- */
    return () => {
      window.removeEventListener("resize", handleResize);

      if (greenBeam) greenBeam.dispose();
      if (orangeBeam) orangeBeam.dispose();

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

export default GalleryCanvas3;
