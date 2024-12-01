import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm, sessionsCount, isLoading }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    await onConfirm();
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Backdrop with animated pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"
        />

        {/* Processing Animation Layer */}
        {isProcessing && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Scanning line effect */}
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            />
            
            {/* Random data points */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-1 h-1 bg-red-500/50"
              />
            ))}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full">
              {[...Array(5)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={Math.random() * 100 + "%"}
                  y1={Math.random() * 100 + "%"}
                  x2={Math.random() * 100 + "%"}
                  y2={Math.random() * 100 + "%"}
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                    delay: i * 0.3
                  }}
                />
              ))}
            </svg>
          </div>
        )}

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl shadow-lg border border-gray-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Tech pattern overlay */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at center, rgb(79, 70, 229, 0.3) 0%, transparent 50%)',
                backgroundSize: '100% 100%',
              }}
            />
          </div>

          {/* Progress Indicator (only shown when processing) */}
          {isProcessing && (
            <div className="absolute -top-3 left-0 right-0 flex justify-center pointer-events-none">
              <div className="px-4 py-1 bg-indigo-600 rounded-full text-white text-sm font-medium shadow-lg">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon icon="eos-icons:loading" className="w-4 h-4" />
                  </motion.div>
                  Processing...
                </motion.div>
              </div>
            </div>
          )}

          {/* Warning Icon with advanced animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative mx-auto w-16 h-16 mb-6 pointer-events-none"
          >
            <motion.div
              animate={isProcessing ? {
                scale: [1, 1.2, 1],
                opacity: [1, 0.5, 1],
                rotate: [0, 180, 360]
              } : {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: isProcessing ? 2 : 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-indigo-500/20 rounded-full"
            />
            <div className="relative w-full h-full bg-indigo-500/10 rounded-full flex items-center justify-center">
              <Icon 
                icon={isProcessing ? "carbon:data-backup" : "ph:warning-circle-fill"}
                className="w-10 h-10 text-indigo-600"
              />
            </div>
          </motion.div>

          {/* Content container with proper z-index */}
          <div className="relative z-10">
            {/* Dynamic Title */}
            <motion.h3
              animate={isProcessing ? {
                scale: [1, 1.02, 1],
                opacity: [1, 0.8, 1],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl font-semibold text-center mb-2 text-gray-900"
            >
              {isProcessing ? 'Terminating Sessions...' : 'Sign Out All Other Devices?'}
            </motion.h3>

            {/* Dynamic Description */}
            <motion.p
              className="text-center mb-6 text-gray-600"
            >
              {isProcessing ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Securely ending {sessionsCount} active {sessionsCount === 1 ? 'session' : 'sessions'}...
                </motion.span>
              ) : (
                `This will end ${sessionsCount} active ${sessionsCount === 1 ? 'session' : 'sessions'} on other devices.`
              )}
            </motion.p>

            {/* Device Icons with dynamic animations */}
            <motion.div
              className="flex justify-center gap-4 mb-6"
            >
              {['laptop', 'phone', 'tablet'].map((device, index) => (
                <motion.div
                  key={device}
                  initial={{ opacity: 1 }}
                  animate={isProcessing ? {
                    opacity: [1, 0.3, 1],
                    scale: [1, 0.9, 1],
                    rotate: [0, 5, 0],
                  } : {}}
                  transition={{
                    duration: 2,
                    delay: index * 0.3,
                    repeat: isProcessing ? Infinity : 0
                  }}
                  className="relative w-12 h-12 rounded-lg flex items-center justify-center bg-gray-50"
                >
                  {isProcessing && (
                    <motion.div
                      className="absolute inset-0 bg-indigo-500/20 rounded-lg pointer-events-none"
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.3,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  <Icon 
                    icon={`ph:${device}`}
                    className="w-7 h-7 text-indigo-600"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            {!isProcessing && (
              <div className="flex gap-3 relative z-50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200
                    rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none
                    focus:ring-2 focus:ring-indigo-500/50 relative z-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg 
                    hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed relative z-50"
                >
                  Sign Out All
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
