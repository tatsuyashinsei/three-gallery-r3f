// Env3Controllers/EnvControls.jsx
import { useControls, folder } from "leva";

const envMapList = {
  選択してくださいーー:
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
  
  // いちばん星前
  "いちばん星前・低画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
  "いちばん星前・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mid.jpg",
  "いちばん星前・高画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_high.jpg",
  "いちばん星前・モバイル":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mobile.jpg",
  
  // グリコ
  "グリコ・低画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_small.jpg",
  "グリコ・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mid.jpg",
  "グリコ・高画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_high.jpg",
  "グリコ・モバイル":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mobile.jpg",
  
  // 阿倍野ハルカス
  "阿倍野ハルカス・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_mid.jpg",
  "阿倍野ハルカス・高画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_high.jpg",
};

// 初期値を定数として定義
const INITIAL_VALUES = {
  environment: true,
  background: true,
  envMap: "選択してくださいーー",
};

export function useEnvControls() {
  const [controls, set] = useControls(() => ({
    "環境設定": folder({
      "環境表示": {
        value: INITIAL_VALUES.environment,
      },
      "背景表示": {
        value: INITIAL_VALUES.background,
      },
      envMap: {
        options: Object.keys(envMapList),
        value: INITIAL_VALUES.envMap,
        label: "背景を選択",
      },
    }, { collapsed: true })
  }));

  // 非表示のコントロールの状態を維持
  return {
    ...controls,
    floor1TextureVisible: false,
    floor2TextureVisible: false,
    beamVisible: false,
    // リセット用のset関数も返す
    resetEnvControls: () => {
      console.log("🔄 [EnvControls] 環境設定リセット実行");
      set({
        "環境表示": INITIAL_VALUES.environment,
        "背景表示": INITIAL_VALUES.background,
        envMap: INITIAL_VALUES.envMap,
      });
      console.log("✅ [EnvControls] 環境設定リセット完了");
    }
  };
}

export { envMapList };
