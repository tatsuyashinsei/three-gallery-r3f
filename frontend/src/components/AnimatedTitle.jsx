import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedTitle({ text }) {
  const titleRef = useRef(null);
  const letterRefs = useRef([]);

  useEffect(() => {
    // 初期アニメーション
    gsap.fromTo(
      letterRefs.current,
      {
        y: -100,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    );

    // ホバーアニメーションの設定
    letterRefs.current.forEach((letter) => {
      letter.addEventListener('mouseenter', () => {
        gsap.to(letter, {
          y: -20,
          scale: 1.2,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      letter.addEventListener('mouseleave', () => {
        gsap.to(letter, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });
    });
  }, []);

  return (
    <h1 
      ref={titleRef} 
      className="text-6xl font-bold mb-12 text-white flex gap-1"
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          ref={(el) => (letterRefs.current[index] = el)}
          className="inline-block cursor-pointer transition-colors hover:text-primary"
          style={{ perspective: "1000px" }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
} 