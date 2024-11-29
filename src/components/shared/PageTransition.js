'use client';

import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
