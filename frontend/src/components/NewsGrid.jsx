import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const newsItems = [
  {
    id: 1,
    title: "夏祭りのお知らせ",
    date: "2024年7月15日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/pot-mussels.jpg",
    excerpt: "今年も恒例の夏祭りを開催します！みんなで楽しく過ごしましょう。",
    link: "/news/1"
  },
  {
    id: 2,
    title: "新しい創作活動プログラムの開始",
    date: "2024年6月1日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/beach-boat.jpg",
    excerpt: "絵画や陶芸など、新しい創作活動プログラムを始めます。",
    link: "/news/2"
  },
  {
    id: 3,
    title: "スポーツ大会参加報告",
    date: "2024年5月20日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/animals/three-dogs.jpg",
    excerpt: "地域のスポーツ大会に参加しました！",
    link: "/news/3"
  },
  {
    id: 4,
    title: "新入職員の紹介",
    date: "2024年4月1日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264644/samples/imagecon-group.jpg",
    excerpt: "新しく仲間になったスタッフを紹介します。",
    link: "/news/4"
  },
  {
    id: 5,
    title: "お花見イベントの様子",
    date: "2024年3月30日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/nature-mountains.jpg",
    excerpt: "みんなで楽しくお花見をしました！",
    link: "/news/5"
  },
  {
    id: 6,
    title: "新年度の活動計画",
    date: "2024年3月15日",
    image: "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/fish-vegetables.jpg",
    excerpt: "2024年度の活動計画をお知らせします。",
    link: "/news/6"
  }
];

export default function NewsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {newsItems.map((item) => (
        <motion.div
          key={item.id}
          className="relative group aspect-square overflow-hidden rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Link to={item.link} className="block w-full h-full">
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm text-white/80">{item.date}</p>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm line-clamp-2">{item.excerpt}</p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 