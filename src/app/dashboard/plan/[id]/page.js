'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const mockData = {
  id: "PAK-OTP-PK1120212",
  usageLimit: 5000,
  usageCount: 4500,
  endDate: "2024-12-31",
  startDate: "2024-01-01",
  apiKeys: [
    { id: 1, key: "pak_live_123456789", status: "active", lastUsed: "2024-01-20", created: "2023-12-01" },
    { id: 2, key: "pak_test_987654321", status: "revoked", lastUsed: "2024-01-15", created: "2023-12-15" },
    { id: 3, key: "pak_live_456789123", status: "active", lastUsed: "2024-01-18", created: "2023-12-10" }
  ]
};

export default function PlanDetails({ params }) {
  const plan = mockData;
  const today = new Date();
  const endDate = new Date(plan.endDate);
  const totalDays = Math.ceil((endDate - new Date(plan.startDate)) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));
  const usagePercentage = (plan.usageCount / plan.usageLimit) * 100;

  const getDaysRemaining = () => {
    return remainingDays;
  };

  const getDaysRemainingPercentage = () => {
    return remainingDays / totalDays;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        {/* Page Header */}
        <div className="relative mb-6 sm:mb-8 md:mb-10">
          {/* Background Glow */}
          <div className="absolute -inset-8 bg-gradient-to-br from-violet-600/5 via-purple-600/5 to-teal-500/5 rounded-2xl backdrop-blur-3xl" />
          <div className="absolute -inset-8 bg-gradient-to-tr from-violet-600/3 via-transparent to-teal-500/3 rounded-2xl" />
          <div className="absolute -top-10 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl opacity-30" />
          <div className="absolute -top-10 left-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl opacity-30" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col items-start p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "2rem" }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="w-1 rounded-full bg-gradient-to-b from-violet-600 via-purple-600 to-teal-500"
                />
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight group"
                >
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
                      Plan Details
                    </span>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="absolute -bottom-0.5 sm:-bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600/80 via-purple-600/80 to-teal-500/80 transform origin-left"
                    />
                    <div className="absolute -z-10 top-1/2 -translate-y-1/2 left-0 right-0 h-[120%] w-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-teal-500/5 blur-xl" />
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.5, 0.3],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/3 via-purple-600/3 to-teal-500/3 blur-lg"
                      />
                    </div>
                  </span>
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="ml-2 sm:ml-4 px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-violet-600/10 to-teal-500/10"
                >
                  <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                    Professional Plan
                  </span>
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 20px -10px rgba(124, 58, 237, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: 0.5 }}
                className="w-full sm:w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 text-white rounded-xl font-medium flex items-center justify-center sm:justify-start gap-2 hover:from-violet-700 hover:via-purple-700 hover:to-teal-600 transition-all shadow-lg shadow-violet-600/20 text-sm sm:text-base"
              >
                <Icon icon="solar:pen-bold" className="w-4 h-4" />
                Update Plan
              </motion.button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-8 pl-0 sm:pl-4 w-full mt-3 sm:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-6 w-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600/10 to-teal-500/10">
                        <Icon icon="solar:settings-bold" className="w-5 h-5 text-violet-600" />
                      </div>
                      <p className="text-base text-gray-600">
                        Manage your plan settings and API keys
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-600/10 to-teal-500/10">
                        <Icon icon="solar:calendar-bold" className="w-5 h-5 text-teal-600" />
                      </div>
                      <p className="text-base text-gray-600">
                        Valid until {new Date(plan.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute -bottom-6 left-0 right-0 flex flex-col items-center"
          >

          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Plan ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 relative group"
          >
            {/* Animated background gradients */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-teal-500/10 rounded-2xl backdrop-blur-xl"></div>

            <div className="relative p-4 sm:p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-violet-600/20 hover:border-violet-600/30 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-violet-600/20 to-teal-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-purple-600/20 to-violet-500/20 rounded-full blur-xl"></div>

              {/* Animated Circles */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute right-12 top-12 w-16 h-16 border-2 border-violet-500/20 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [90, 0, 90],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.5
                }}
                className="absolute right-10 top-10 w-20 h-20 border-2 border-teal-500/20 rounded-full"
              />

              {/* Decorative Dots Grid */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 grid grid-cols-2 gap-2">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-600 to-teal-500"
                  />
                ))}
              </div>

              {/* Glass morphism effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>

              {/* Content */}
              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600/10 to-teal-500/10">
                      <Icon icon="solar:key-minimalistic-square-bold" className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">Plan ID</h3>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600/10 to-teal-500/10"
                  >
                    <span className="text-sm font-medium bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                      Active
                    </span>
                  </motion.div>
                </div>

                <div className="pl-11 space-y-3">
                  <div className="relative group/copy cursor-pointer">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-mono font-semibold tracking-wide bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-teal-500/90 bg-clip-text text-transparent group-hover/copy:from-violet-700 group-hover/copy:via-purple-700 group-hover/copy:to-teal-600 transition-all duration-300">
                        {plan.id}
                      </p>
                      <Icon
                        icon="solar:copy-bold"
                        className="w-4 h-4 text-gray-400 group-hover/copy:text-violet-600 transition-colors"
                      />
                    </div>
                    <motion.div
                      initial={false}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-0 opacity-0 translate-y-1 px-2 py-1 bg-gray-900 text-white text-xs rounded pointer-events-none"
                    >
                      Click to copy
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon icon="solar:calendar-bold" className="w-4 h-4 text-violet-600" />
                      Created on {new Date(plan.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon icon="solar:refresh-circle-bold" className="w-4 h-4 text-teal-600" />
                      Renews automatically
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Usage and Plan Validity Section */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Usage Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/40 to-teal-50/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.05)_0%,rgba(20,184,166,0.05)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(60deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.7)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.9)_0%,transparent_100%)]" />
              </div>

              <div className="relative">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-violet-600 via-purple-600 to-teal-500 rounded-lg shadow-lg shadow-violet-100/50">
                        <Icon icon="solar:graph-new-bold" className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-base font-medium text-gray-900">Usage Overview</h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Track your SMS usage</p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="mt-4 sm:mt-6 md:mt-8">
                  {/* Stats */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Total Credits</h3>
                        <span className="text-sm text-gray-400">{plan.usageLimit.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-600 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Used Credits</h3>
                        <span className="text-sm text-gray-400">{plan.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-600 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${usagePercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-500">Remaining Credits</h3>
                        <span className="text-sm text-gray-400">{(plan.usageLimit - plan.usageCount).toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-600 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - usagePercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Circular Progress */}
                  <div className="flex justify-center items-center mt-6">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="#f3f4f6"
                          strokeWidth="20"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="80"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="20"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: usagePercentage / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeDasharray="502"
                          strokeDashoffset="0"
                        />
                        {/* Gradient Definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="100%" stopColor="#14b8a6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                          {usagePercentage.toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-600 mt-1">Usage Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Plan Validity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100 md:col-span-2 lg:col-span-3"
            >
              <div className="relative">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-violet-600 to-teal-500 rounded-lg shadow-lg shadow-violet-100/50">
                        <Icon icon="solar:calendar-bold" className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-base font-medium text-gray-900">Plan Validity</h2>
                    </div>
                    <p className="text-sm text-gray-600">Time remaining in your plan</p>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col items-center justify-center mt-6">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* Background Circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="20"
                      />
                      {/* Progress Circle */}
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="url(#gradient2)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: getDaysRemainingPercentage() }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeDasharray="502"
                        strokeDashoffset="0"
                      />
                      {/* Gradient Definition */}
                      <defs>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent">
                        {getDaysRemaining()}
                      </span>
                      <span className="text-sm text-gray-600 mt-1">Days Left</span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600">Plan Duration</div>
                    <div className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-violet-600 to-teal-500 bg-clip-text text-transparent mt-1">
                      {Math.round(getDaysRemainingPercentage() * 100)}% Remaining
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* API Keys Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-3 sm:p-4 md:p-6 shadow-sm border border-gray-100 md:col-span-2 lg:col-span-3"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="p-3 bg-gradient-to-br from-violet-600 via-purple-600 to-teal-500 rounded-xl shadow-lg shadow-violet-100">
                  <Icon icon="solar:key-bold" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-600">API Keys</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <span className="text-sm text-gray-600">
                        {plan.apiKeys.filter(k => k.status === 'active').length} Active
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                      <span className="text-sm text-gray-600">
                        {plan.apiKeys.filter(k => k.status === 'revoked').length} Revoked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-teal-500 text-white rounded-xl hover:from-violet-700 hover:via-purple-700 hover:to-teal-600 shadow-lg shadow-violet-100/50 transition-all flex items-center justify-center sm:justify-start gap-2 text-sm font-medium"
              >
                <Icon icon="solar:add-circle-bold" className="w-4 h-4" />
                <span>New API Key</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {plan.apiKeys.map((key, index) => (
                <motion.div
                  key={key.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-2 sm:p-3 md:p-4 rounded-xl border border-gray-100 hover:border-violet-100 hover:shadow-sm hover:shadow-violet-50 transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className={`p-2 rounded-lg ${
                        key.status === 'active'
                          ? 'bg-gradient-to-br from-violet-50 to-teal-50'
                          : 'bg-rose-50'
                      }`}>
                        <Icon
                          icon="solar:key-bold"
                          className={`w-4 h-4 ${
                            key.status === 'active'
                              ? 'text-violet-600'
                              : 'text-rose-500'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base break-all">{key.key}</div>
                        <div className="text-xs sm:text-sm text-gray-600 break-all">{key.key}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        key.status === 'active'
                          ? 'bg-gradient-to-br from-violet-50 to-teal-50 text-violet-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {key.status}
                      </span>
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigator.clipboard.writeText(key.key)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white transition-all"
                        >
                          <Icon icon="solar:copy-bold" className="w-4 h-4" />
                        </motion.button>
                        {key.status === 'active' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition-all"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
