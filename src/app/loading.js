'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="relative">
        {/* Main spinning loader */}
        <div className="w-16 h-16 relative">
          <div className="absolute w-full h-full rounded-full border-[3px] border-transparent border-t-indigo-600 animate-spin" />
          <div className="absolute w-full h-full rounded-full border-[3px] border-transparent border-l-purple-600 animate-spin-slow" />
          
          {/* Gradient ring */}
          <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-20 animate-pulse" />
        </div>
        
        {/* Pulsing background circle */}
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-full animate-pulse blur-xl" />
        
        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium">
            Loading...
          </span>
        </div>
      </div>
    </motion.div>
  );
}
