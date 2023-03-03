import { motion } from 'framer-motion';

export default function Layout({ children }) {
  return (
    // Transition animation between pages
    <motion.div
      className="w-full h-screen bg-base text-black font-lato"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
}
