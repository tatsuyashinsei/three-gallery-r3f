// beamUtils.js

import * as THREE from "three";

export function getColorFromType(type) {
  switch (type) {
    case "green":
      return new THREE.Color(0x00ff00);  // 純緑色
    case "orange":
      return new THREE.Color(0xffcc00);  // より黄色寄りの色に変更
    default:
      console.warn(`[beamUtils] Unknown beam type: ${type}, using default green`);
      return new THREE.Color(0x00ff00);
  }
}

export function getYOffsetFromType(type) {
  switch (type) {
    case "green":
      return 0.0;  // グリーンビームのY軸オフセット
    case "orange":
      return -0.2; // オレンジビームのY軸オフセット（少し下に）
    default:
      console.warn(`[beamUtils] Unknown beam type: ${type}, using default offset`);
      return 0.0;
  }
}
