'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function PlanCard({ plan }) {
  return (
    <Link href={`/dashboard/plan/${plan.id}`} key={plan.id}>
      <motion.div
        whileHover={{ 
          y: -8,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        {/* Card Container */}
        <div className="relative bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 lg:p-9 shadow-lg overflow-hidden isolate">
          {/* Gradient Orbs */}
          <div 
            className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 rounded-full"
            style={{
              background: plan.name === 'Professional' 
                ? 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: 'translate3d(0, 0, 0)',
            }}
          />
          <div 
            className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full"
            style={{
              background: plan.name === 'Professional' 
                ? 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: 'translate3d(0, 0, 0)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              {/* Plan Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <motion.div 
                    className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${
                      plan.name === 'Professional' 
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10' 
                        : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon 
                      icon={plan.name === 'Professional' ? 'solar:crown-bold-duotone' : 'solar:rocket-bold-duotone'} 
                      className={`w-6 h-6 ${
                        plan.name === 'Professional' 
                          ? 'text-indigo-600' 
                          : 'text-blue-600'
                      }`}
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {plan.name}
                  </h3>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 mr-1.5 text-gray-400" />
                  Expires {new Date(plan.endDate).toLocaleDateString()}
                </div>
              </div>

              {/* Status Badge */}
              <div className="relative">
                <motion.div 
                  className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 flex items-center space-x-1.5"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="text-sm font-medium text-emerald-700">Active</span>
                </motion.div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-5">
              {/* Progress Section */}
              <div>
                <div className="flex justify-between items-end mb-1.5">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Usage Overview</div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {Math.round((plan.usageCount / plan.usageLimit) * 100)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500">
                      {plan.usageCount.toLocaleString()} / {plan.usageLimit.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">Credits Used</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full relative"
                    style={{
                      background: plan.name === 'Professional'
                        ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.8) 0%, rgba(79, 70, 229, 0.8) 100%)'
                        : 'linear-gradient(90deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 100%)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(plan.usageCount / plan.usageLimit) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  >
                    {/* Animated Shine Effect */}
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        animation: 'shine 2s infinite linear'
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="relative overflow-hidden">
                  <motion.div 
                    className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Used</div>
                        <div className="text-lg font-bold text-gray-900">
                          {plan.usageCount.toLocaleString()}
                        </div>
                      </div>
                      <Icon 
                        icon="solar:graph-up-bold-duotone" 
                        className="w-5 h-5 text-indigo-500"
                      />
                    </div>
                    <div className="text-xs text-gray-400">Total Credits Used</div>
                  </motion.div>
                </div>

                <div className="relative overflow-hidden">
                  <motion.div 
                    className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Limit</div>
                        <div className="text-lg font-bold text-gray-900">
                          {plan.usageLimit.toLocaleString()}
                        </div>
                      </div>
                      <Icon 
                        icon="solar:chart-square-bold-duotone" 
                        className="w-5 h-5 text-purple-500"
                      />
                    </div>
                    <div className="text-xs text-gray-400">Maximum Credits</div>
                  </motion.div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button 
                className="w-full relative overflow-hidden rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-90" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4wNSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZmlsbD0idXJsKCNnKSIgZD0iTTAgMGgyMDB2MjAwSDB6Ii8+PC9zdmc+')] bg-cover opacity-100" />
                <div className="relative px-5 py-2.5 flex items-center justify-center space-x-2">
                  <span className="text-white font-medium">View Details</span>
                  <Icon 
                    icon="solar:arrow-right-bold-duotone" 
                    className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" 
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] opacity-0 group-hover:opacity-10 transition-opacity -z-10" />
      </motion.div>
    </Link>
  );
}
