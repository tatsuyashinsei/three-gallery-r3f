import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.8 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export default function ScrollRevealSection({ 
  children, 
  animation = 'fadeIn',
  className = '',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
}) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  });

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={selectedAnimation}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 