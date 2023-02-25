import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

const handEnterAnimation: Variants = {
  initial: {
    opacity: 0.5,
    rotate: 90,
    y: 100,
    originY: 1, // pivot from the bottom
  },

  animate: {
    opacity: 1,
    y: 5, // move the down a bit so it doesn't look like it's floating
    rotate: 0,
    transition: {
      duration: 3,
      type: 'spring',
      bounce: 0.2,
    },
  },
};

const handWobbleAnimation: Variants = {
  animate: {
    x: [0, 5],
    y: [5, 10],
    rotate: [0, 4],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'mirror',
    },
  },
};

export default function Hand() {
  const [currentAnimation, setCurrentAnimation] = useState(handEnterAnimation);

  return (
    <motion.img
      className="z-0 place-self-end md:block mt-8 md:mt-0 md:w-1/2"
      src="/assets/hand_map.png"
      alt="Mapa"
      variants={currentAnimation}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => setCurrentAnimation(handWobbleAnimation)}
    />
  );
}
