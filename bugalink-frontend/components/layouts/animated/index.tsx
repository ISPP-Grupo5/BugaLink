import { motion } from 'framer-motion';

export default function AnimatedLayout({ children, className = '' }) {
  return (
    // Transition animation between pages

    <motion.div
      className={'w-full h-screen font-lato bg-baseOrigin ' + className}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'tween',
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
