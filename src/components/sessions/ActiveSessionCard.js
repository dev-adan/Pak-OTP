'use client';

import { Icon } from '@iconify/react';
import { formatDistanceToNow } from 'date-fns';

export default function ActiveSessionCard({ session, onLogout }) {
  const deviceInfo = session.deviceInfo;
  const isCurrentSession = session.isCurrentSession;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="text-gray-600 dark:text-gray-400">
          <Icon 
            icon={
              deviceInfo.device.toLowerCase() === 'mobile' ? 'material-symbols:phone-android' :
              deviceInfo.device.toLowerCase() === 'tablet' ? 'material-symbols:tablet' :
              'material-symbols:computer'
            }
            width={24}
            height={24}
          />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {deviceInfo.browser} on {deviceInfo.os}
            {isCurrentSession && (
              <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                Current Device
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last active {formatDistanceToNow(new Date(session.lastAccessed))} ago
            {session.ipAddress && ` • ${session.ipAddress}`}
          </div>
        </div>
      </div>
      
      {!isCurrentSession && (
        <button
          onClick={() => onLogout(session._id)}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
          title="Logout this device"
          disabled={session.isCurrentSession}
        >
          <Icon icon="material-symbols:logout" width={20} height={20} />
        </button>
      )}
    </div>
  );
}
