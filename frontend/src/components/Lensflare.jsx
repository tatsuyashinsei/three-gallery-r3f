// Lensflare.jsx
import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare";

const LensflareComponent = ({ position = [0, 0, 20] }) => {
  // publicディレクトリからテクスチャを読み込み
  const textureFlare0 = useLoader(
    THREE.TextureLoader,
    "/textures/lensflare0.png", // public/textures/lensflare0.png
  );
  const textureFlare3 = useLoader(
    THREE.TextureLoader,
    "/textures/lensflare3.png", // public/textures/lensflare3.png
  );
  console.log("✅ Textures loaded:", textureFlare0, textureFlare3);

  const { light, sunMesh } = useMemo(() => {
    const light = new THREE.PointLight("white", 9, 2000);
    light.position.set(...position);

    const lensflare = new Lensflare();

    lensflare.renderOrder = 9999;
    lensflare.addElement(
      new LensflareElement(textureFlare0, 90, 0, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 80, 0, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 300, 0, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 2000, 0, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 500, 0.05, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 300, 0.15, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 100, 0.35, light.color),
    );
    lensflare.addElement(
      new LensflareElement(textureFlare0, 8000, 0, light.color),
    );

    lensflare.addElement(new LensflareElement(textureFlare3, 100, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 200, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 1));

    light.add(lensflare);

    const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: "mistyrose" });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.copy(light.position);

    return { light, sunMesh };
  }, [textureFlare0, textureFlare3, position]);

  return (
    <>
      <primitive object={light} />
      <primitive object={sunMesh} />
    </>
  );
};
export default LensflareComponent;
