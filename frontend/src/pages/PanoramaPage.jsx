import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Pane } from "tweakpane";

const PanoramaPage = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const manager = new THREE.LoadingManager();
    manager.onProgress = (_, l, t) => setProgress(Math.floor((l / t) * 100));
    manager.onLoad = () => setIsLoading(false);

    // シーンのセットアップ
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;

    // 環境設定オプション
    const envOptions = {
      current: "デフォルト",
      mapList: {
        "選択してください": "",
        "いちばん星前・低画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
        "いちばん星前・中画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mid.jpg",
        "いちばん星前・高画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_high.jpg",
        "いちばん星前滑走スマホ不可": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae.jpg",
        "グリコ・低画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_small.jpg",
        "グリコ・中画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mid.jpg",
        "グリコ・高画質スマホ熟々": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_high.jpg",
        "グリコ滑走プラスマイナス": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi.jpg",
        "阿倍野ハルカス・中画質": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_mid.jpg",
        "阿倍野ハルカススマモリ飛ぶ": 
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas.jpg",
        "大阪城・低画質":
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/OsakaCastle_small.jpg",
        "大阪城・中画質":
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/OsakaCastle_mid.jpg",
        "大阪城・高画質":
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/OsakaCastle_high.jpg",
        "大阪城パノラマ":
          "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/OsakaCastle.jpg",
      },
    };

    // GUI設定
    const pane = new Pane();
    const envFolder = pane.addFolder({ title: "環境設定" });

    // テクスチャローダー
    const loader = new THREE.TextureLoader(manager);

    // パノラマ球体のジオメトリ
    const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // 環境マップを読み込む関数
    const loadEnvironmentMap = (url) => {
      if (!url) return;
      
      loader.load(url, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.encoding = THREE.sRGBEncoding;
        sphereMaterial.map = texture;
        sphereMaterial.needsUpdate = true;
      });
    };

    // GUI制御
    envFolder.addBinding(envOptions, "current", {
      options: Object.keys(envOptions.mapList),
    }).on("change", (ev) => {
      const url = envOptions.mapList[ev.value];
      loadEnvironmentMap(url);
    });

    // 初期パノラマを読み込み
    loadEnvironmentMap(envOptions.mapList["いちばん星前・中画質"]);

    // アニメーションループ
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // リサイズハンドラ
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      pane.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "24px",
            textAlign: "center",
          }}
        >
          Loading... {progress}%
        </div>
      )}
    </>
  );
};

export default PanoramaPage; 