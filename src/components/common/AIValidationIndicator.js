'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function AIValidationIndicator({ 
  isValidating, 
  isValid, 
  error, 
  showIndicator 
}) {
  if (!showIndicator) return null;

  return (
    <div className="relative mt-1">
      <AnimatePresence mode="wait">
        {isValidating ? (
          <motion.div
            key="validating"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-indigo-600"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
              </motion.div>
            </div>
            <span className="text-sm font-medium">AI analyzing message...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-500"
          >
            <div className="relative">
              <Icon icon="mdi:alert-circle" className="w-5 h-5" />
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0.2)",
                    "0 0 0 10px rgba(239, 68, 68, 0)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              {error}
            </motion.span>
          </motion.div>
        ) : isValid ? (
          <motion.div
            key="valid"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-green-500"
          >
            <div className="relative">
              <Icon icon="mdi:check-circle" className="w-5 h-5" />
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(34, 197, 94, 0.2)",
                    "0 0 0 10px rgba(34, 197, 94, 0)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full"
              />
            </div>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium"
            >
              Message verified
            </motion.span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
