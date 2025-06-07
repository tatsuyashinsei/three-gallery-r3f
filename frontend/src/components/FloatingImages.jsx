import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const images = [
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264644/samples/imagecon-group.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/people/bicycle.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264643/samples/animals/three-dogs.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/pot-mussels.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264642/samples/food/fish-vegetables.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/beach-boat.jpg",
  "https://res.cloudinary.com/dxcotqkhe/image/upload/v1746264641/samples/landscapes/nature-mountains.jpg",
];

const getRandomPosition = () => {
  return {
    x: Math.random() * window.innerWidth - 150,
    y: Math.random() * window.innerHeight - 150,
    scale: Math.random() * 0.5 + 0.5,
    rotate: Math.random() * 30 - 15,
  };
};

const FloatingImage = ({ src, index }) => {
  const [position, setPosition] = useState(getRandomPosition());

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(getRandomPosition());
    }, Math.random() * 5000 + 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute w-[300px] h-[200px] rounded-lg overflow-hidden shadow-2xl"
      style={{ zIndex: index }}
      animate={{
        x: position.x,
        y: position.y,
        scale: position.scale,
        rotate: position.rotate,
      }}
      initial={{ opacity: 0, scale: 0 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.2, zIndex: 10 }}
    >
      <motion.img
        src={src}
        alt="Floating"
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
};

export default function FloatingImages() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {images.map((src, index) => (
        <FloatingImage key={src} src={src} index={index} />
      ))}
    </div>
  );
} 