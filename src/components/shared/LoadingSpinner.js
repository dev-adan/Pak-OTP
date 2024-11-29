'use client';

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="relative">
        <div className="h-16 w-16">
          <div className="absolute animate-spin rounded-full h-16 w-16 border-[3px] border-solid border-indigo-400 border-t-transparent"></div>
          <div className="absolute animate-ping rounded-full h-16 w-16 border-[3px] border-solid border-indigo-400 opacity-20"></div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    </div>
  );
}
