'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';

export default function ActiveSessionCard({ session, onRevoke, isCurrentSession }) {
  const getDeviceIcon = (deviceInfo) => {
    const os = deviceInfo.os.toLowerCase();
    if (os.includes('windows')) return 'logos:microsoft-windows';
    if (os.includes('mac')) return 'logos:apple';
    if (os.includes('linux')) return 'logos:linux-tux';
    if (os.includes('android')) return 'logos:android';
    if (os.includes('ios')) return 'logos:ios';
    return 'material-symbols:devices';
  };

  const getBrowserIcon = (deviceInfo) => {
    const browser = deviceInfo.browser.toLowerCase();
    if (browser.includes('chrome')) return 'logos:chrome';
    if (browser.includes('firefox')) return 'logos:firefox';
    if (browser.includes('safari')) return 'logos:safari';
    if (browser.includes('edge')) return 'logos:microsoft-edge';
    return 'material-symbols:web';
  };

  const formatLastActivity = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 relative"
    >
      {isCurrentSession && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Current Session
        </span>
      )}
      
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Icon icon={getDeviceIcon(session.deviceInfo)} className="w-8 h-8" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {session.deviceInfo.os} Device
              </h3>
              <Icon icon={getBrowserIcon(session.deviceInfo)} className="w-5 h-5" />
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <div className="flex items-center space-x-2">
                <Icon icon="material-symbols:location-on" className="w-4 h-4" />
                <span>IP: {session.deviceInfo.ip}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Icon icon="material-symbols:schedule" className="w-4 h-4" />
                <span>Last active {formatLastActivity(session.lastActivity)}</span>
              </div>
            </div>
          </div>
        </div>

        {!isCurrentSession && (
          <button
            onClick={() => onRevoke(session._id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
                     transition-colors duration-200 flex items-center space-x-1 text-sm"
          >
            <Icon icon="material-symbols:logout" className="w-5 h-5" />
            <span>End Session</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
