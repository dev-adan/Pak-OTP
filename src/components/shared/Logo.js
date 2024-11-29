'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Logo({ className = '', showText = true, href = '/' }) {
  return (
    <Link href={href} className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 md:w-12 md:h-12 relative">
        <motion.svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background hexagon */}
          <motion.path
            d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
            className="fill-indigo-600"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: "easeOut"
            }}
          />

          {/* Fingerprint-inspired curves */}
          <motion.path
            d="M35 50 C35 40, 50 40, 50 50 C50 60, 65 60, 65 50"
            className="fill-none stroke-white stroke-[3]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <motion.path
            d="M30 45 C30 35, 50 35, 50 45 C50 55, 70 55, 70 45"
            className="fill-none stroke-white stroke-[3]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.path
            d="M40 55 C40 45, 50 45, 50 55 C50 65, 60 65, 60 55"
            className="fill-none stroke-white stroke-[3]"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          {/* Key hole */}
          <motion.circle
            cx="50"
            cy="45"
            r="6"
            className="fill-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          />
          <motion.path
            d="M46 45 L54 45 L50 60 Z"
            className="fill-white"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          />

          {/* Glowing effect */}
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            className="fill-none stroke-white/30 stroke-[2]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.1, opacity: [0, 0.5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        </motion.svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-indigo-600 leading-none">Pak-OTP</span>
          <span className="text-xs text-gray-500">Secure Authentication</span>
        </div>
      )}
    </Link>
  );
}
