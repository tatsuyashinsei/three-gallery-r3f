import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Instagramの埋め込みスクリプトを読み込む関数
const loadInstagramEmbed = () => {
  if (window.instgrm) {
    window.instgrm.Embeds.process();
  } else {
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }
};

// いちばん星のInstagramフィード
const instagramPosts = [
  'https://www.instagram.com/ichibanboshiboshi/p/',
];

function InstagramFeed() {
  useEffect(() => {
    loadInstagramEmbed();
  }, []);

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="instagram-post rounded-lg overflow-hidden shadow-lg col-span-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <iframe
          src="https://www.instagram.com/ichibanboshiboshi/embed"
          width="100%"
          height="450"
          frameBorder="0"
          scrolling="no"
          allowTransparency="true"
          className="rounded-lg"
        ></iframe>
      </motion.div>
    </motion.div>
  );
}

export default InstagramFeed; 