// Env3Controllers/EnvControls.jsx
import { useControls } from "leva";

const envMapList = {
  選択してくださいーー:
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_small.jpg",
  "いちばん星前・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/ShinseiIriguchiMae_mid.jpg",
  "グリコ・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/EbisuBashi_mid.jpg",
  "阿倍野ハルカス・中画質":
    "https://cdn.jsdelivr.net/gh/threejsconf/hdr@main/Harukas_mid.jpg",
};

export function useEnvControls() {
  const controls = useControls("環境設定", {
    "環境表示": {
      value: true,
    },
    "背景表示": {
      value: true,
    },
    envMap: {
      options: Object.keys(envMapList),
      value: "選択してくださいーー",
      label: "背景を選択",
    },
  });

  // 非表示のコントロールの状態を維持
  return {
    ...controls,
    floor1TextureVisible: false,
    floor2TextureVisible: false,
    beamVisible: false,
  };
}

export { envMapList };
