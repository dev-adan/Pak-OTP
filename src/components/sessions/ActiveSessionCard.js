'use client';

import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function ActiveSessionCard({ session, onLogout }) {
  const deviceInfo = session.deviceInfo;
  const isCurrentSession = session.isCurrentSession;

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const glowVariants = {
    initial: { opacity: 0 },
    animate: { opacity: [0.5, 0.15, 0.5], transition: { duration: 2, repeat: Infinity } }
  };

  const iconVariants = {
    initial: { rotate: 0 },
    hover: { rotate: 360, transition: { duration: 0.5 } }
  };

  // Get appropriate icon and color based on device type
  const getDeviceIcon = () => {
    const type = deviceInfo.device.toLowerCase();
    if (type === 'mobile') return 'material-symbols:phone-android';
    if (type === 'tablet') return 'material-symbols:tablet';
    return 'material-symbols:computer';
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="relative w-[280px] h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 
                 rounded-2xl overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        variants={glowVariants}
        initial="initial"
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
      />

      {/* Decorative circuit lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-gray-700/50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-gray-700/50" />
      </div>

      {/* Content container */}
      <div className="relative h-full p-4 flex flex-col justify-between">
        {/* Top section with device icon */}
        <div className="flex items-start justify-between">
          <motion.div
            variants={iconVariants}
            className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl
                       shadow-lg shadow-black/20"
          >
            <Icon 
              icon={getDeviceIcon()}
              className="text-indigo-400"
              width={24}
              height={24}
            />
          </motion.div>

          {isCurrentSession && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                         bg-green-500/20 border border-green-500/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">Current</span>
            </motion.div>
          )}
        </div>

        {/* Middle section with device info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-100">
            {deviceInfo.browser}
          </h3>
          <p className="text-sm text-gray-400">
            {deviceInfo.os}
          </p>
        </div>

        {/* Bottom section with time and actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Icon icon="mdi:clock-outline" width={14} height={14} />
            <span>
              {formatDistanceToNow(new Date(session.lastAccessed))}
            </span>
          </div>

          {!isCurrentSession && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLogout(session._id)}
              className="p-2 rounded-lg text-red-400 hover:text-red-300 
                         hover:bg-red-500/20 transition-colors duration-200"
              title="Logout this device"
            >
              <Icon icon="material-symbols:logout" width={18} height={18} />
            </motion.button>
          )}
        </div>

        {/* IP Address tooltip */}
        {session.ipAddress && (
          <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-gray-500
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex items-center justify-center gap-1">
              <Icon icon="mdi:ip-network-outline" width={12} height={12} />
              <span>{session.ipAddress}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
