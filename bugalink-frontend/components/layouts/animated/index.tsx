import { motion } from 'framer-motion';

export default function AnimatedLayout({ children, className = '' }) {
  return (
    // Transition animation between pages

    <motion.div
      className={'h-screen w-full bg-base-origin font-lato ' + className}
      initial={{ x: 25, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -25, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
