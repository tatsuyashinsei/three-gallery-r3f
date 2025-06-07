import { Float } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const images = [
  'https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264644/samples/imagecon-group.jpg',  // グループ写真
  'https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/people/bicycle.jpg',  // アクティビティ
  'https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/nature-mountains.jpg',  // 自然
  'https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/pot-mussels.jpg',  // イベント
  'https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/beach-boat.jpg',  // アウトドア
];

export default function FloatingBackgroundImages() {
  const { viewport } = useThree();

  // テクスチャの事前読み込み
  const textures = images.map(url => {
    const texture = new THREE.TextureLoader().load(url);
    texture.minFilter = THREE.LinearFilter;  // アンチエイリアス設定
    return texture;
  });

  // 画像の位置をビューポートの範囲内でランダムに設定
  const positions = [
    [-viewport.width * 0.3, viewport.height * 0.2, -10],
    [viewport.width * 0.3, -viewport.height * 0.3, -12],
    [-viewport.width * 0.2, -viewport.height * 0.2, -8],
    [viewport.width * 0.2, viewport.height * 0.3, -15],
    [0, 0, -20],
  ];

  return (
    <group>
      {positions.map((position, index) => (
        <Float
          key={index}
          speed={0.5} // よりゆっくりとした浮遊
          rotationIntensity={0} // 回転なし
          floatIntensity={1.5} // 適度な浮遊の強さ
          position={position}
        >
          <mesh>
            <planeGeometry args={[4, 3]} /> {/* アスペクト比を調整 */}
            <meshBasicMaterial
              transparent
              opacity={0.15} // より薄く
              map={textures[index]}
              side={THREE.DoubleSide}
              depthWrite={false} // 透明度の処理を改善
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
} 