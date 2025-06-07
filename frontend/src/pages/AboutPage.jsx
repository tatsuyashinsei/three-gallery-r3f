import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Star, Calendar, Book, Music, Camera, Palette } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, Cloud, Environment } from '@react-three/drei';
import ScrollRevealSection from '../components/ScrollRevealSection';

const AboutPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f172a] overflow-hidden relative z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={2} />
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <Cloud opacity={0.15} speed={0.3} width={20} depth={1.5} segments={20} />
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
          <Link to="/main" className="btn btn-ghost btn-sm gap-2 text-white hover:text-white">
            <ArrowLeft size={16} />
            メインページに戻る
          </Link>
        </motion.div>

        {/* 代表あいさつ */}
        <ScrollRevealSection 
          animation="fadeIn" 
          className="bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
            <Heart className="text-pink-400" />
            代表あいさつ
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-1/3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.img
                  src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264644/samples/imagecon-group.jpg"
                  alt="代表理事 吉川芽莉"
                  className="w-full rounded-lg shadow-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              </motion.div>
              <p className="text-center mt-4 font-bold text-white">代表理事 吉川芽莉</p>
            </div>
            <div className="md:w-2/3 space-y-4">
              {[
                "どの方の人生背景も大切にし、",
                "みなさんのこれからの人生が",
                "彩あるものになりますよう、",
                "全力でご支援させていただくことを",
                "お約束いたします。",
                "一人一人の個性を大切に、",
                "共に歩んでいきたいと思います。"
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
            <motion.img
              src="https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/landscapes/nature-mountains.jpg"
              alt="施設の外観"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
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
                description: "専門スタッフによる質の高い福祉サービスを提供しています。"
              },
              {
                icon: <Heart className="text-pink-400" />,
                title: "居場所づくり",
                description: "障がいのある人や子ども、その家族やきょうだいの居場所づくりをしています。"
              },
              {
                icon: <Star className="text-yellow-400" />,
                title: "地域連携",
                description: "地域社会との繋がりを大切にし、共生社会の実現を目指しています。"
              }
            ].map((item, index) => (
              <ScrollRevealSection
                key={index}
                animation="scaleUp"
                delay={index * 0.2}
                className="card bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg overflow-hidden"
              >
                <motion.div 
                  className="card-body"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-title flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </div>
                  <p>{item.description}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Book className="text-green-400" />,
                title: "学習支援",
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/animals/kitten-playing.gif",
                description: "個々の特性に合わせた学習支援を行っています。"
              },
              {
                icon: <Music className="text-purple-400" />,
                title: "音楽活動",
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/spices.jpg",
                description: "音楽を通じた感性の育成と交流を図ります。"
              },
              {
                icon: <Camera className="text-indigo-400" />,
                title: "写真教室",
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/beach-boat.jpg",
                description: "写真撮影を通じて自己表現を学びます。"
              },
              {
                icon: <Palette className="text-orange-400" />,
                title: "アート活動",
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/pot-mussels.jpg",
                description: "創作活動を通じて想像力を育みます。"
              }
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
                <motion.div 
                  className="card-body"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-title flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </div>
                  <p>{item.description}</p>
                </motion.div>
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
                title: "春の遠足開催",
                description: "桜の季節に合わせて、近隣の公園への遠足を企画しています。"
              },
              {
                date: "2024年5月",
                title: "新規プログラム開始",
                description: "音楽療法プログラムを新たに開始します。"
              },
              {
                date: "2024年6月",
                title: "夏祭り準備開始",
                description: "恒例の夏祭りの準備を開始します。皆様のご参加をお待ちしています。"
              }
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
                  <div className="text-yellow-400 font-bold md:w-1/6">{item.date}</div>
                  <div className="md:w-5/6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white">{item.description}</p>
                  </div>
                </motion.div>
              </ScrollRevealSection>
            ))}
          </div>
        </ScrollRevealSection>

        {/* インスタグラム */}
        <ScrollRevealSection 
          animation="slideInRight" 
          className="mt-16 mb-16 bg-white/10 backdrop-blur-xl rounded-lg p-8 shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl font-bold mb-8 text-white flex items-center gap-3">
            <Camera className="text-pink-400" />
            インスタグラム
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/animals/three-dogs.jpg",
                title: "みんなでお散歩",
                date: "2024年3月15日"
              },
              {
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/spices.jpg",
                title: "クッキング教室",
                date: "2024年3月10日"
              },
              {
                image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/beach-boat.jpg",
                title: "春の遠足",
                date: "2024年3月5日"
              }
            ].map((post, index) => (
              <ScrollRevealSection
                key={index}
                animation="fadeInUp"
                delay={index * 0.2}
                className="card bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition-all border border-white/20 shadow-lg overflow-hidden"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-lg font-bold">{post.title}</h3>
                    <p className="text-sm text-gray-200">{post.date}</p>
                  </div>
                </motion.div>
              </ScrollRevealSection>
            ))}
          </div>
          <div className="text-center mt-8">
            <motion.a
              href="https://www.instagram.com/ichibanboshiboshi/p/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold hover:from-purple-600 hover:to-pink-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              もっと見る
              <ArrowLeft className="rotate-180" size={16} />
            </motion.a>
          </div>
        </ScrollRevealSection>
      </div>
    </motion.div>
  );
};

export default AboutPage; 