'use client';

import { motion } from 'framer-motion';

export default function Documentation() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Documentation
        </h1>
        <p className="text-gray-500 text-sm mt-1">API documentation and integration guides</p>
      </div>

      {/* Placeholder Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg className="w-full h-full text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Documentation Coming Soon</h3>
          <p className="text-gray-500">
            We're currently working on comprehensive documentation for our API and integration guides.
            Check back soon for updates.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
