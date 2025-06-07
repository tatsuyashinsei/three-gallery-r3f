import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AnimatedCard({ to, image, alt, icon, text, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Link 
        to={to} 
        className="flex items-center gap-6 bg-base-200 p-4 rounded-lg hover:bg-base-300 transition-colors"
      >
        <div className="relative overflow-hidden rounded-lg">
          <motion.img
            src={image}
            alt={alt}
            className="w-24 h-24 object-cover"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-lg">{icon} {text}</span>
      </Link>
    </motion.li>
  );
} 