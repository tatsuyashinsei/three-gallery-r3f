// beamUtils.js

import * as THREE from "three";

export function getColorFromType(type) {
  if (type === "green") return new THREE.Color(0x00ff00);
  if (type === "yellow") return new THREE.Color(0xffff00);
  if (type === "orange") return new THREE.Color(0xffa500);
  return new THREE.Color(0xffffff);
}

export function getYOffsetFromType(type) {
  if (type === "green") return 0.0;
  if (type === "yellow") return 0.2;
  if (type === "orange") return 0.2;
  return 0.0;
}
