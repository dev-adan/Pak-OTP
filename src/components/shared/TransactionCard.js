'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function TransactionCard({ purchase }) {
  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return 'solar:card-bold-duotone';
      case 'PayPal':
        return 'logos:paypal';
      default:
        return 'solar:bank-bold-duotone';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <div className="relative">
        {/* Main Card */}
        <div className="relative bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white opacity-60" />
          
          {/* Main Content */}
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left Section with Plan Info */}
              <div className="flex items-center gap-5">
                {/* Icon Container */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50"
                  >
                    <Icon 
                      icon="solar:card-recive-bold-duotone" 
                      className="w-6 h-6 text-indigo-600"
                    />
                  </motion.div>
                </div>

                {/* Plan Details */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-900">
                      {purchase.planName}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {purchase.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 mr-1.5 text-indigo-500/70" />
                      {new Date(purchase.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4 mr-1.5 text-indigo-500/70" />
                      {new Date(purchase.date).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      }).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section with Amount */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    ${purchase.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center justify-end gap-1.5">
                    <Icon 
                      icon={getPaymentIcon(purchase.paymentMethod)} 
                      className="w-4 h-4" 
                    />
                    {purchase.paymentMethod}
                  </div>
                </div>
              </div>
            </div>

            {/* Expandable Details Section */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-5 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Transaction Details */}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Transaction ID</div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {purchase.transactionId}
                    <button className="text-indigo-600 hover:text-indigo-700">
                      <Icon icon="solar:copy-bold-duotone" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Credits Info */}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Credits Purchased</div>
                  <div className="font-medium text-gray-900">
                    {purchase.credits.toLocaleString()} credits
                  </div>
                </div>

                {/* Price per Credit */}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Price per Credit</div>
                  <div className="font-medium text-gray-900">
                    ${(purchase.amount / purchase.credits).toFixed(4)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
