import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Star, Calendar, Book, Music, Camera, Palette, Building2, X, Instagram } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Cloud, Environment, useTexture } from '@react-three/drei';
import ScrollRevealSection from '../components/ScrollRevealSection';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import SimpleModal from '../components/SimpleModal';
import { fetchInstagramPosts } from '../api/instagram';

const RotatingCube = () => {
  const meshRef = useRef();
  const [scrollY, setScrollY] = useState(0);
  const [randomOffset, setRandomOffset] = useState({ x: 0, y: 0, z: 0 });
  const texture = useTexture("https://res.cloudinary.com/dxcotqkhe/image/upload/v1747605770/S__4071451_dqr3ei.jpg");
  
  // テクスチャの設定
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  // スクロールイベントのリスニング
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // スクロールごとにランダムなオフセットを生成（確率的に）
      if (Math.random() < 0.1) { // 10%の確率で新しいランダム値を設定
        setRandomOffset({
          x: (Math.random() - 0.5) * 4, // -2 から 2 の範囲
          y: (Math.random() - 0.5) * 3, // -1.5 から 1.5 の範囲
          z: (Math.random() - 0.5) * 6  // -3 から 3 の範囲
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // アニメーション
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 基本的な回転
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.z += delta * 0.1;

    // スクロールに基づく動的な変化
    const scrollProgress = scrollY * 0.001; // スクロール進行度
    const time = state.clock.elapsedTime;

    // 位置の動的変化（スクロール + ランダム + 時間ベース）
    const baseX = Math.sin(time * 0.5) * 2 + randomOffset.x;
    const baseY = Math.cos(time * 0.3) * 1.5 + randomOffset.y;
    const baseZ = -5 + Math.sin(scrollProgress * 2) * 2 + randomOffset.z;

    // スクロールに応じた左右の移動
    const lateralMovement = Math.sin(scrollProgress * 3) * 3;
    
    meshRef.current.position.set(
      baseX + lateralMovement,
      baseY + Math.sin(scrollProgress * 4) * 2,
      baseZ
    );

    // スケールの動的変化
    const scaleBase = 2;
    const scaleVariation = Math.sin(time * 0.8) * 0.5 + Math.cos(scrollProgress * 5) * 0.8;
    const randomScale = 1 + (Math.sin(time * 2.3) * 0.3);
    meshRef.current.scale.setScalar(scaleBase + scaleVariation * randomScale);

    // カメラの動的な位置変更
    if (state.camera) {
      // スクロールに応じてカメラを移動
      const cameraX = Math.sin(scrollProgress * 1.5) * 2;
      const cameraY = Math.cos(scrollProgress * 1.2) * 1.5;
      const cameraZ = 5 + Math.sin(scrollProgress * 2) * 2;
      
      state.camera.position.set(cameraX, cameraY, cameraZ);
      
      // カメラの回転（キューブを追従）
      const targetX = meshRef.current.position.x;
      const targetY = meshRef.current.position.y;
      const targetZ = meshRef.current.position.z;
      
      state.camera.lookAt(targetX, targetY, targetZ);
    }

    // 透明度の変化（深度に応じて）
    if (meshRef.current.material) {
      const opacity = Math.max(0.3, Math.min(1.0, 1.0 - Math.abs(baseZ + 5) * 0.1));
      meshRef.current.material.opacity = opacity;
      meshRef.current.material.transparent = true;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]} scale={2}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        map={texture} 
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
};

const FacilityModal = ({ isOpen, onClose, facility }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* モーダルコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-20 bg-white/50 backdrop-blur-xl rounded-xl shadow-2xl z-50 overflow-auto"
          >
            <div className="relative p-4 sm:p-6 md:p-8">
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 btn btn-circle btn-sm"
              >
                <X size={16} />
              </button>

              <div className="w-[90%] sm:w-[85%] md:w-[80%] max-w-2xl mx-auto">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">{facility.title}</h2>
                  <p className="text-lg text-base-content/70">{facility.description}</p>
                </div>

                {/* 施設画像 */}
                <div className="aspect-video rounded-lg overflow-hidden mb-8">
                  <motion.img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* 施設詳細情報 */}
                <div className="grid gap-8">
                  {facility.title === "新星" ? (
                    <>
                      <section>
                        <h3 className="text-xl font-bold mb-4">サービス内容</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>就労継続支援B型事業所（定員10名）</li>
                          <li>生活介護事業所（定員10名）</li>
                          <li>送迎サービス（応相談）</li>
                          <li>給食サービス（希望制）</li>
                        </ul>
                      </section>
                      <section>
                        <h3 className="text-xl font-bold mb-4">活動内容</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>軽作業（箱折り、シール貼り、部品組立など）</li>
                          <li>創作活動（手芸、絵画、陶芸など）</li>
                          <li>レクリエーション活動</li>
                          <li>地域交流活動</li>
                        </ul>
                      </section>
                    </>
                  ) : (
                    <>
                      <section>
                        <h3 className="text-xl font-bold mb-4">サービス内容</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>就労継続支援B型事業所（定員20名）</li>
                          <li>送迎サービス（応相談）</li>
                          <li>給食サービス（希望制）</li>
                        </ul>
                      </section>
                      <section>
                        <h3 className="text-xl font-bold mb-4">活動内容</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>パソコン作業（データ入力、画像加工など）</li>
                          <li>事務作業（書類整理、ファイリングなど）</li>
                          <li>軽作業（箱折り、シール貼りなど）</li>
                          <li>職業訓練プログラム</li>
                        </ul>
                      </section>
                    </>
                  )}
                  <section>
                    <h3 className="text-xl font-bold mb-4">利用時間</h3>
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-bold">平日</h4>
                        <p>9:00 〜 16:00</p>
                      </div>
                      <div>
                        <h4 className="font-bold">土曜日</h4>
                        <p>9:00 〜 13:00（プログラムによる）</p>
                      </div>
                      <div>
                        <h4 className="font-bold">休業日</h4>
                        <p>日曜日・祝日・お盆・年末年始</p>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// 代表あいさつモーダル
const GreetingModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* モーダルコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-20 bg-white/50 backdrop-blur-xl rounded-xl shadow-2xl z-50 overflow-auto"
          >
            <div className="relative p-4 sm:p-6 md:p-8">
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 btn btn-circle btn-sm"
              >
                <X size={16} />
              </button>

              <div className="w-[90%] sm:w-[85%] md:w-[80%] max-w-2xl mx-auto">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">代表あいさつ</h2>
                  <p className="text-lg text-base-content/70">代表理事 吉川芽莉</p>
                </div>

                {/* 代表画像 */}
                <div className="aspect-video rounded-lg overflow-hidden mb-8">
                                     <motion.img
                    src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1749260549/MeriYoshikawaGIF_lzg9gw.gif"
                    alt="代表理事"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* あいさつ文 */}
                <div className="prose prose-lg max-w-none">
                  <p>こんにちは。私たち大阪府東大阪市で活動しています<br />NPO法人いちばん星です☺</p>
                  <p>障がいのある人たちやその家族の居場所づくりをしたいなと思い、<br />いちばん星を立ち上げたのが2006年。</p>
                  <p>障がいのある人たちやその家族、きょうだい達の交流会を目的とした<br />イベント活動を中心として活動してきました。</p>
                  <p>2018年に事業所を立ちあげて以降も、私の活動の中心にはずっと<br />「居場所づくり」があります☺</p>
                  <p>障がいのある人もその家族もきょうだいも、みんなが自分の立場に納得しながら過ごすことのできるよう、<br />これからも私たちにできることを探し続けていきたいと思います☺</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ServicesModalコンポーネント
const ServicesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="relative">
      {/* オーバーレイ */}
      <div
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-black/60 z-[9998]"
      />
      
      {/* モーダルコンテンツ */}
      <div
        className="fixed inset-10 bg-white rounded-xl shadow-2xl z-[9999] overflow-auto p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-center">施設案内</h2>
          <p className="text-center text-gray-600 mt-2">テスト表示</p>
        </div>
      </div>
    </div>
  );
};

// TestModal component
const TestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-0 bg-black/50" />
      <div className="bg-white p-8 rounded-lg shadow-xl relative z-[10000]">
        <h2 className="text-2xl font-bold mb-4">テストモーダル</h2>
        <p>モーダルのテスト表示です</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

// Minimal Modal Component
const MinimalModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 9999 }}
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg p-6 m-4 max-w-xl w-full relative"
        style={{ zIndex: 10000 }}
      >
        <h2 style={{ marginBottom: '20px' }}>テストモーダル</h2>
        <p>これはテストモーダルです。</p>
        <button 
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

// サービス詳細モーダル
const ServiceDetailModal = ({ isOpen, onClose, service }) => {
  if (!isOpen || !service) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const facilitiesInfo = {
    "障害福祉サービス": (
      <div className="space-y-8">
        {/* 新星 */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">就労継続支援B型・生活介護 新星</h3>
          <h4 className="text-lg font-semibold">施設概要</h4>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="font-semibold">種別</dt>
              <dd className="ml-4">多機能事業所 （就労継続支援B型 生活介護） 新星</dd>
            </div>
            <div>
              <dt className="font-semibold">住所</dt>
              <dd className="ml-4">〒578-0941<br />大阪府東大阪市岩田町5-8-13</dd>
            </div>
            <div>
              <dt className="font-semibold">TEL</dt>
              <dd className="ml-4">072-927-3279</dd>
            </div>
            <div>
              <dt className="font-semibold">FAX</dt>
              <dd className="ml-4">072-921-3335</dd>
            </div>
            <div>
              <dt className="font-semibold">アクセス</dt>
              <dd className="ml-4">近鉄奈良線 若江岩田駅下車 徒歩5分</dd>
            </div>
            <div>
              <dt className="font-semibold">利用定員</dt>
              <dd className="ml-4">
                就労継続支援B型 10名<br />
                生活介護 10名
              </dd>
            </div>
            <div>
              <dt className="font-semibold">サービス提供日時</dt>
              <dd className="ml-4">
                月〜土曜日 9:30-16:00<br />
                （この中から障がいの状態に対応し通所日をお選びいただけます）<br />
                休日：日・祝・お盆・年末年始など
              </dd>
            </div>
          </dl>
        </section>

        {/* 超新星 */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">就労継続支援B型 超新星</h3>
          <h4 className="text-lg font-semibold">施設概要</h4>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="font-semibold">種別</dt>
              <dd className="ml-4">就労継続支援B型 超新星</dd>
            </div>
            <div>
              <dt className="font-semibold">住所</dt>
              <dd className="ml-4">〒578-0941<br />大阪府東大阪市岩田町5-8-21</dd>
            </div>
            <div>
              <dt className="font-semibold">TEL</dt>
              <dd className="ml-4">072-921-9259</dd>
            </div>
            <div>
              <dt className="font-semibold">FAX</dt>
              <dd className="ml-4">072-926-4695</dd>
            </div>
            <div>
              <dt className="font-semibold">アクセス</dt>
              <dd className="ml-4">近鉄奈良線 若江岩田駅下車 徒歩5分</dd>
            </div>
            <div>
              <dt className="font-semibold">利用定員</dt>
              <dd className="ml-4">20名</dd>
            </div>
            <div>
              <dt className="font-semibold">サービス提供日時</dt>
              <dd className="ml-4">
                月〜土曜日 9:30-16:00<br />
                （この中から障がいの状態に対応し通所日をお選びいただけます）<br />
                休日：日・祝・お盆・年末年始など
              </dd>
            </div>
          </dl>
        </section>

        {/* 相談支援事業所 */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">相談支援事業所 いちばん星</h3>
          <h4 className="text-lg font-semibold">施設概要</h4>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="font-semibold">種別</dt>
              <dd className="ml-4">相談支援事業所 いちばん星</dd>
            </div>
            <div>
              <dt className="font-semibold">住所</dt>
              <dd className="ml-4">〒578-0941<br />大阪府東大阪市岩田町5-8-13</dd>
            </div>
            <div>
              <dt className="font-semibold">TEL</dt>
              <dd className="ml-4">072-921-3245</dd>
            </div>
            <div>
              <dt className="font-semibold">FAX</dt>
              <dd className="ml-4">072-926-5243</dd>
            </div>
            <div>
              <dt className="font-semibold">アクセス</dt>
              <dd className="ml-4">近鉄奈良線 若江岩田駅下車 徒歩5分</dd>
            </div>
            <div>
              <dt className="font-semibold">提供日時</dt>
              <dd className="ml-4">
                月〜土曜日 9:30-16:00<br />
                休日・日・祝・お盆・年末年始など
              </dd>
            </div>
            <div>
              <dt className="font-semibold">対象</dt>
              <dd className="ml-4">障がいのあるお子様や福祉サービスのご利用希望のある方</dd>
            </div>
          </dl>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">相談支援事業所 いちばん星ができること</h4>
            <ul className="space-y-4">
              <li>
                <h5 className="font-semibold">地域の障がい福祉サービスについての情報提供</h5>
                <p className="ml-4">地域の障がい児者の福祉サービスについて、ご不明な点がありましたらご相談ください。</p>
              </li>
              <li>
                <h5 className="font-semibold">日常生活全般に関する相談</h5>
                <p className="ml-4">日常生活におけるご質問について、お気軽にご相談ください。</p>
              </li>
              <li>
                <h5 className="font-semibold">障がい児（者）利用計画の作成</h5>
                <p className="ml-4">障がい福祉サービス利用に必要な利用計画書の作成を行います。</p>
              </li>
              <li>
                <h5 className="font-semibold">ヘルパーなど福祉サービスの利用状況の把握・調整</h5>
                <p className="ml-4">利用状況を把握し、事業所間や事業所と利用者間の調整を行います。</p>
              </li>
            </ul>
          </div>
        </section>

        {/* グループホーム */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">グループホーム</h3>
          <h4 className="text-lg font-semibold">施設概要</h4>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="font-semibold">種別</dt>
              <dd className="ml-4">
                グループホーム<br />
                ＜ひこぼしII＞定員男性3名<br />
                ＜ひこぼしIII＞定員男性3名<br />
                ＜ひこぼしIV＞定員男性5名<br />
                ＜おりひめ＞定員女性3名<br />
                ＜あまのがわ＞定員男性2名<br />
                ＜ぱんだ＞定員男性7名<br />
                ＜こんぺいとう＞ワンルーム型<br />
                ＜ささのは＞ワンルーム型
              </dd>
            </div>
            <div>
              <dt className="font-semibold">住所</dt>
              <dd className="ml-4">大阪府東大阪市付近</dd>
            </div>
          </dl>
        </section>
      </div>
    ),
    "居場所づくり": (
      <div className="space-y-8">
        <section className="space-y-6">
          <h3 className="text-2xl font-bold border-b pb-2">居場所づくり</h3>
          
          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              いちばん星は2006年に設立以降、障がいのある人や子ども、きょうだい、家族同士の交流を目的とした
              イベントの開催を行っています。
            </p>

            <p className="leading-relaxed">
              自分の家族だけではなかなか経験できないことを体験することや、家族で参加する経験することの大切さ、
              同じ境遇の仲間に出会え、気軽に日々の話ができたり、日々の想いや生活を共感しあえること…
              そんな何気ない時間が「自分は一人じゃないんだ」と思え、また明日を頑張れる力になると私は信じています☺
            </p>

            <p className="text-lg font-semibold text-center my-6">
              誰にとっても居場所は必要☺
            </p>

            <p className="leading-relaxed">
              たくさんの経験をする中で楽しい気持ちも悲しい気持ちもしながら、仲間と繋がり合っていこう☺
            </p>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">これまでのイベント例…</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="leading-relaxed">
                バーベキュー大会、陶芸教室、日帰りキャンプ、宿泊体験、味覚狩り、クリスマス会、お花見、プール、海水浴、
                クッキング、新年会、ベンガラ染体験、お茶会　etc…
              </p>
            </div>
          </div>
        </section>
      </div>
    ),
    "きょうだいの会「キラリ」": (
      <div className="space-y-8">
        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">きょうだいの会「キラリ」って？</h3>
          <p className="ml-4">
            障がいのある人（おとなもこどもも）の兄弟姉妹が集まるところです。
            障がいのある人の兄弟姉妹のことをひらがな表記で「きょうだい」といいます☺
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">どんな活動をしているの？</h3>
          <ul className="ml-4 list-disc list-inside space-y-2">
            <li>きょうだいだけが参加できるイベントの開催</li>
            <li>いちばん星のスタッフ、ボランティアさんと一緒に遊びに行こう</li>
            <li>きょうだいに関する講演会やシンポジウムの開催</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">「キラリ」の活動を通して</h3>
          
          <div className="ml-4 space-y-6">
            <div>
              <h4 className="text-lg font-semibold">こどものきょうだい支援は…</h4>
              <p className="ml-4">まずは「楽しい」思いをたくさんすることから。</p>
              <div className="ml-4 space-y-2">
                <p>≪いつもの自分の家庭での役割を脱ぎ捨てよう≫</p>
                <p>≪わがままがたくさん言える日や場所があったって良い≫</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold">おとなのきょうだい支援は…</h4>
              <p className="ml-4">同士に出会うこと。</p>
              <div className="ml-4 space-y-2">
                <p>≪自身の結婚どうする？≫</p>
                <p>≪親なきあとどうする？≫</p>
              </div>
              <div className="mt-4 ml-4">
                <p>上記に正解や答えはありません。</p>
                <p>解決方法もありません。</p>
                <p>ただただ一緒に悩み考えていこう。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">≪きょうだいの会で得るものってどんなこと？≫</h3>
          <ul className="ml-4 space-y-2">
            <li>🌟大事な自分に気づきます。</li>
            <li>🌟自分の気持ちが言葉になること。言語化されることってとても大切です。</li>
            <li>🌟同士である仲間に出会うこと。『一人じゃない。』って感じること。</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">きょうだいの会の大切さ</h3>
          <div className="ml-4 space-y-4">
            <p>きょうだいの会には、子どもも大人もみんな必要です。</p>
            
            <div className="space-y-4">
              <div>
                <p>子どもはきょうだいの先輩である大人と遊んだり、話す時間</p>
                <div className="ml-4">
                  <p>→『楽しかったし、なんだか分からないけどホッとしたよ』</p>
                  <p>　『みんな同じなんだってわかって安心したよ』</p>
                </div>
              </div>
              
              <div>
                <p>大人は後輩である子どもと遊んだり、話す時間</p>
                <div className="ml-4">
                  <p>→『胸がいっぱいになる』『自分の過去をリアルに思い出す』</p>
                  <p>　『自分の気持ちに改めて向き合う、消化する』</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold border-b pb-2">≪みんなで一緒に悩んでいこう≫</h3>
          <div className="ml-4 space-y-4">
            <p className="font-semibold">「どんな気持ちを持っていても大丈夫。」</p>
            <div className="space-y-2">
              <p>悩まないことが良いのではありません。</p>
              <p>悩みに向き合う力をつけよう。</p>
            </div>
            <div className="space-y-2">
              <p>「そう思っていたのは自分だけじゃないんだね」</p>
              <p>自分一人でないことを知ることは何よりもの安心感。</p>
            </div>
            <div className="space-y-2">
              <p>"お兄ちゃん、お姉ちゃん、弟、妹がいたからこそ"の出会いを楽しみにしています☺</p>
              <p>なにかあればいつでもご相談下さいね☺</p>
            </div>
          </div>
        </section>
      </div>
    )
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{ zIndex: 9999 }}
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg p-6 m-4 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
        style={{ zIndex: 10000 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
        
        <div className="mt-2">
          <div className="flex items-center gap-3 mb-4">
            {service.icon}
            <h2 className="text-2xl font-bold">{service.title}</h2>
          </div>
          
          {facilitiesInfo[service.title] || (
            <>
              <p className="text-gray-700 mb-6">{service.description}</p>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">詳細情報</h3>
                <p>このサービスに関する詳細な情報がここに表示されます。</p>
              </div>
            </>
          )}
          
          <button
            onClick={onClose}
            className="w-full mt-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

// いちばん星とは？モーダル
const AboutIchibanHoshiModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* オーバーレイ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/60 z-50"
          />
          
          {/* モーダルコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-20 bg-white/50 backdrop-blur-xl rounded-xl shadow-2xl z-50 overflow-auto"
          >
            <div className="relative p-4 sm:p-6 md:p-8">
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 btn btn-circle btn-sm"
              >
                <X size={16} />
              </button>

              <div className="w-[90%] sm:w-[85%] md:w-[80%] max-w-4xl mx-auto">
                {/* ヘッダー */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">私たちについて</h2>
                </div>

                {/* 施設詳細情報 */}
                <div className="space-y-8">
                  {/* いちばん星の目指すもの */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">いちばん星の目指すもの</h3>
                    <ul className="list-disc list-inside space-y-3 text-base-content/80">
                      <li>障がいがあっても、楽しく過ごせる、行ったらホッとできる、そんな居場所を提供します。</li>
                      <li>障がい者・児を持つ家族が気軽に集え、悩みなどを語れる場を提供します。</li>
                      <li>今置かれている障がい者（児）の現状を、社会に訴えかけていき、平等な社会作り"を目指します。</li>
                      <li>いちばん星に関わる人たちみんなが笑顔でいられる団体でありたいと思っています。</li>
                    </ul>
                  </section>

                  {/* 概要 */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">概要</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">名称</h4>
                          <p className="text-base-content/80">特定非営利活動法人 いちばん星</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">所在地</h4>
                          <p className="text-base-content/80">〒578-0941 大阪府東大阪市岩田町5-8-13</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">TEL</h4>
                          <p className="text-base-content/80">072-927-3279</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">FAX</h4>
                          <p className="text-base-content/80">072-921-3335</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">設立年月日</h4>
                          <p className="text-base-content/80">2006年3月27日</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">代表理事</h4>
                          <p className="text-base-content/80">吉川 芽莉</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">事業内容</h4>
                        <ul className="list-disc list-inside text-base-content/80 space-y-1">
                          <li>就労継続支援B型</li>
                          <li>生活介護</li>
                          <li>相談支援事業所</li>
                        </ul>
                        <div className="mt-4">
                          <p className="font-semibold">グループ会社　株式会社かささぎ</p>
                          <ul className="list-disc list-inside text-base-content/80">
                            <li>共同生活援助</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 活動内容 */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">活動内容</h3>
                    <ul className="list-disc list-inside space-y-2 text-base-content/80">
                      <li>障がい児・者、そのご家族同士の交流を目的としたイベントの開催</li>
                      <li>障がい児・者のきょうだいの会「キラリ」の活動</li>
                      <li>会報誌「いちばん星TIMES」の発行</li>
                      <li>講師派遣（障がい児・者のきょうだいについての講師・講演）</li>
                    </ul>
                  </section>

                  {/* 沿革 */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">沿革</h3>
                    <div className="space-y-4">
                      {[
                        { year: '2006年3月', events: ['NPO法人 いちばん星 設立', 'ボランティア・イベント・講演活動を開催'] },
                        { year: '2008年8月', events: ['きょうだい会「キラリ」発足'] },
                        { year: '2011年4月', events: ['東日本大震災支援・義援金活動参加'] },
                        { year: '2006年〜2018年', events: ['ふれあい祭り、バーベキュー大会、お茶会、いちばん星カット、きょうだい会、宿泊体験、日帰りバスツアー、クリスマスなど'] },
                        { year: '2018年9月', events: ['就労継続支援B型 新星（現在の超新星の場所に） 開所'] },
                        { year: '2020年2月', events: ['グループホーム「ひこぼし」開所'] },
                        { year: '2020年11月', events: ['グループホーム「ひこぼしII」開所'] },
                        { year: '2021年1月', events: ['就労継続支援B型 新星（現在の場所に） 移動', '相談支援 「いちばん星」・生活介護「新星」 開所'] },
                        { year: '2021年2月', events: ['グループホーム「おりひめ」開所'] },
                        { year: '2022年9月', events: ['就労継続支援B型「超新星」開所'] },
                        { year: '2022年3月', events: ['グループホーム「あまのがわ」開所'] },
                        { year: '2022年4月', events: ['グループホーム「ひこぼしIII」開所'] }
                      ].map((period, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="font-semibold w-32 flex-shrink-0">{period.year}</div>
                          <div className="flex-1">
                            <ul className="space-y-1 text-base-content/80">
                              {period.events.map((event, eventIndex) => (
                                <li key={eventIndex}>{event}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 決算報告 */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">決算報告</h3>
                    <div className="text-base-content/80">
                      <p className="font-semibold">令和6年度決算報告</p>
                      <a 
                        href="https://drive.google.com/file/d/1tOblwH0WHs9XyBCsZGW5bOnkEZZwzMTn/view"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline"
                      >
                        いちばん星事業計画書令和6年3月期
                      </a>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AboutPage = () => {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isGreetingOpen, setIsGreetingOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleServiceClick = (service) => {
    console.log('Service clicked:', service.title);
    setSelectedService(service);
  };

  useEffect(() => {
    console.log('Test modal state:', isTestModalOpen);
  }, [isTestModalOpen]);

  useEffect(() => {
    const loadInstagramPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const accessToken = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
        const posts = await fetchInstagramPosts(accessToken);
        setInstagramPosts(posts);
      } catch (error) {
        console.error('Instagram投稿の取得に失敗:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadInstagramPosts();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4 sm:px-6 lg:px-8">
        {/* 3D Background */}
        <div className="fixed inset-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              fade
              speed={2}
            />
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <Cloud
              opacity={0.15}
              speed={0.3}
              width={20}
              depth={1.5}
              segments={20}
            />
            <RotatingCube />
            <Environment preset="night" />
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-24">
          {/* 戻るボタン */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/main"
              className="btn btn-ghost btn-sm gap-2 text-white hover:text-white"
            >
              <ArrowLeft size={16} />
              メインページに戻る
            </Link>
          </motion.div>

          {/* 事業所案内ヘッダーセクション */}
          <div className="mt-20 mb-32 relative">
            {/* 装飾的な星のライン上部 */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
            
            <div className="container mx-auto px-4">
              <div className="text-center relative">
                {/* 背景の帯 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-transparent via-gray-800/80 to-transparent backdrop-blur-sm h-20 w-full max-w-md rounded-full border border-yellow-400/30"></div>
                </div>
                
                {/* メインコンテンツ */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 100 }}
                  className="relative z-10 py-8"
                >
                  <div className="inline-flex items-center gap-4 mb-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    >
                      <Star className="w-10 h-10 text-yellow-400 filter drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.h1 
                      className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      style={{ 
                        backgroundSize: "200% 200%",
                        textShadow: "0 0 20px rgba(250, 204, 21, 0.5)"
                      }}
                    >
                      事業所案内
                    </motion.h1>
                    
                    <motion.div
                      animate={{ 
                        rotate: [360, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
                      }}
                    >
                      <Star className="w-10 h-10 text-yellow-400 filter drop-shadow-lg" />
                    </motion.div>
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
                  >
                    一人一人の輝きを大切に、共に歩む支援を目指しています
                  </motion.p>
                  
                  {/* 装飾的な小さな星 */}
                  <div className="absolute -top-4 left-1/4">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-300" />
                    </motion.div>
                  </div>
                  
                  <div className="absolute -bottom-4 right-1/4">
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1.5
                      }}
                    >
                      <Star className="w-3 h-3 text-yellow-300" />
                    </motion.div>
                  </div>
                  
                  <div className="absolute top-8 right-1/3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 180, 360],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.8
                      }}
                    >
                      <Star className="w-2 h-2 text-yellow-200" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* 装飾的な星のライン下部 */}
            <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
          </div>
          
          {/* 代表あいさつ */}
          <ScrollRevealSection
            animation="slideInLeft"
            className="mb-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Heart className="text-pink-400" />
              代表あいさつ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotate: 5,
                  }}
                  transition={{ 
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200,
                  }}
                  onClick={() => setIsGreetingOpen(true)}
                  className="cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1749260549/MeriYoshikawaGIF_lzg9gw.gif"
                      alt="代表理事"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="card-body p-4">
                    <h3 className="card-title text-xl font-bold mb-2 text-white">
                      代表理事 吉川芽莉
                    </h3>
                  </div>
                </motion.div>
              </div>
              <div className="md:w-2/3 space-y-4">
                {[
                  "どの方の人生背景も大切にし、",
                  "みなさんのこれからの人生が",
                  "彩あるものになりますよう、",
                  "全力でご支援させていただくことを",
                  "お約束いたします。",
                  "一人一人の個性を大切に、",
                  "共に歩んでいきたいと思います。",
                ].map((text, index) => (
                  <ScrollRevealSection
                    key={index}
                    animation="slideInRight"
                    delay={index * 0.15}
                    className="text-lg text-white"
                  >
                    {text}
                  </ScrollRevealSection>
                ))}
              </div>
            </div>
          </ScrollRevealSection>

          {/* 法人概要 */}
          <ScrollRevealSection
            animation="slideInLeft"
            className="mt-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Star className="text-yellow-400" />
              いちばん星とは？
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div
                className="cursor-pointer"
                onClick={() => setIsAboutModalOpen(true)}
              >
                <motion.img
                  src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1749264471/ShinseiIchinichi001_gkjcpk.gif"
                  alt="施設の外観"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div className="space-y-4">
                <p className="text-lg text-white">
                  私たち『いちばん星』は大阪府東大阪市に在住し、家族の中に肢体不自由児・知的障がい児（者）を持つ者同士が集まって立ち上げたNPO法人です。
                </p>
                <p className="text-lg text-white">
                  地域に根ざした支援活動を行い、障がいのある方とその家族が安心して暮らせる社会づくりを目指しています。
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="text-blue-400" />,
                  title: "障害福祉サービス",
                  description:
                    "専門スタッフによる質の高い福祉サービスを提供しています。",
                },
                {
                  icon: <Heart className="text-pink-400" />,
                  title: "居場所づくり",
                  description:
                    "障がいのある人や子ども、その家族やきょうだいの居場所づくりをしています。",
                },
                {
                  icon: <Star className="text-yellow-400" />,
                  title: "地域連携",
                  description:
                    "地域社会との繋がりを大切にし、共生社会の実現を目指しています。",
                },
              ].map((item, index) => (
                <ScrollRevealSection
                  key={index}
                  animation="scaleUp"
                  delay={index * 0.2}
                  className="card bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg overflow-hidden"
                >
                  <motion.div
                    className="card-body cursor-pointer"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleServiceClick(item)}
                  >
                    <div className="card-title flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </div>
                    <p>{item.description}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(item);
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      詳しく見る
                    </button>
                  </motion.div>
                </ScrollRevealSection>
              ))}
            </div>
          </ScrollRevealSection>

          {/* 事業所案内 */}
          <ScrollRevealSection
            animation="slideInLeft"
            className="mt-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Building2 className="text-blue-400" />
              事業所案内
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "新星",
                  image:
                    "https://res.cloudinary.com/dxcotqkhe/image/upload/v1749268799/Shinsei_1_ba55ap.gif",
                  description: "就労継続支援B型・生活介護",
                },
                {
                  title: "超新星",
                  image:
                    "https://res.cloudinary.com/dxcotqkhe/image/upload/v1749269712/Choshinsei_pigrmo.gif",
                  description: "就労継続支援B型",
                },
              ].map((item, index) => (
                <ScrollRevealSection
                  key={index}
                  animation="rotateIn"
                  delay={index * 0.3}
                  className="card bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg overflow-hidden"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 5,
                    }}
                    transition={{ 
                      duration: 0.4,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <div className="relative h-48">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="card-body p-4">
                      <h3 className="card-title text-xl font-bold mb-2">
                        {item.title}
                      </h3>
                      <p>{item.description}</p>
                      <button 
                        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        onClick={() => setSelectedFacility(item)}
                      >
                        詳しく見る
                      </button>
                    </div>
                  </motion.div>
                </ScrollRevealSection>
              ))}
            </div>
          </ScrollRevealSection>

          {/* 活動内容 */}
          <ScrollRevealSection
            animation="slideInRight"
            className="mt-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Calendar className="text-blue-400" />
              活動内容
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Heart className="text-indigo-400" />,
                  title: "きょうだいの会「キラリ」",
                  image:
                    "https://res.cloudinary.com/dxcotqkhe/image/upload/v1749273354/brother_twkyma.gif",
                  description:
                    "障がいのある方のきょうだいが集まる場所です。お気軽にご相談ください☺",
                },
                {
                  icon: <Palette className="text-orange-400" />,
                  title: "余暇活動",
                  image:
                    "https://res.cloudinary.com/dxcotqkhe/image/upload/v1749274222/YokaKatsudou_jodlvx.gif",
                  description:
                    "クリスマス会・バーベキュー・お花見など週に1回の外食支援、地域のお祭りに出店、地域の障がい者スポーツ大会に参加など",
                },
              ].map((item, index) => (
                <ScrollRevealSection
                  key={index}
                  animation="fadeInUp"
                  delay={index * 0.2}
                  className="card bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  </motion.div>
                  <div className="card-body">
                    <div className="card-title flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </div>
                    <p>{item.description}</p>
                    <button 
                      onClick={() => setSelectedService(item)}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      詳しく見る
                    </button>
                  </div>
                </ScrollRevealSection>
              ))}
            </div>
          </ScrollRevealSection>

          {/* お知らせ */}
          <ScrollRevealSection
            animation="slideInLeft"
            className="mt-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Calendar className="text-green-400" />
              お知らせ
            </h2>
            <div className="space-y-4">
              {[
                {
                  date: "2024年4月",
                  title: "新しいホームページ",
                  description:
                    "🌟新しくホームページを作成しました☺よろしくお願いいたします☺",
                },
                {
                  date: "2024年5月",
                  title: "法人20年目を迎えました",
                  description: "たくさんの人に最大限のありがとう",
                },
                {
                  date: "2025年4月",
                  title: "4/10はきょうだいの日",
                  description:
                    "きょうだいの日（シブリングデー）は、父の日や母の日のきょうだい版の記念日です。",
                },
              ].map((item, index) => (
                <ScrollRevealSection
                  key={index}
                  animation="slideInRight"
                  delay={index * 0.2}
                  className="bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20"
                >
                  <motion.div
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="text-yellow-400 font-bold md:w-1/6">
                      {item.date}
                    </div>
                    <div className="md:w-5/6">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white">{item.description}</p>
                    </div>
                  </motion.div>
                </ScrollRevealSection>
              ))}
            </div>
          </ScrollRevealSection>

          {/* Instagram */}
          <ScrollRevealSection
            animation="slideInRight"
            className="mt-16 mb-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
          >
            <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
              <Instagram className="text-pink-400" />
              Instagram
            </h2>
            
            {/* 投稿グリッド */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {isLoadingPosts ? (
                // ローディング表示
                <div className="col-span-3 flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
              ) : instagramPosts.length > 0 ? (
                instagramPosts.map((post, index) => (
                  <ScrollRevealSection
                    key={post.id}
                    animation="fadeInUp"
                    delay={index * 0.2}
                    className="overflow-hidden rounded-lg shadow-lg"
                  >
                    <motion.a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-square"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-lg font-bold text-white">{post.title}</h3>
                        <p className="text-sm text-gray-200">{post.date}</p>
                      </div>
                    </motion.a>
                  </ScrollRevealSection>
                ))
              ) : (
                // エラー時や投稿がない場合の表示
                <div className="col-span-3 text-center text-white py-8">
                  <p>現在、投稿を表示できません。</p>
                  <p>Instagramで最新の投稿をご覧ください。</p>
                </div>
              )}
            </div>

            {/* フォローボタン */}
            <div className="text-center">
              <motion.a
                href="https://www.instagram.com/ichibanboshiboshi/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram className="w-6 h-6" />
                フォローする
              </motion.a>
              <p className="mt-4 text-white text-lg">
                日々の活動やイベントの様子を発信しています
              </p>
            </div>
          </ScrollRevealSection>
        </div>
      </div>

      {/* モーダル */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
      <ServicesModal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
      />
      <FacilityModal
        isOpen={!!selectedFacility}
        onClose={() => setSelectedFacility(null)}
        facility={selectedFacility}
      />
      <GreetingModal
        isOpen={isGreetingOpen}
        onClose={() => setIsGreetingOpen(false)}
      />
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="施設案内"
      >
        <div className="space-y-6">
          <section>
            <h3 className="text-xl font-bold mb-2">新星</h3>
            <p>就労継続支援B型・生活介護</p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-2">超新星</h3>
            <p>就労継続支援B型</p>
          </section>

          <button
            onClick={handleCloseModal}
            className="w-full mt-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            閉じる
          </button>
        </div>
      </SimpleModal>
      <ServiceDetailModal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
      <AboutIchibanHoshiModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </>
  );
};

export default AboutPage; 