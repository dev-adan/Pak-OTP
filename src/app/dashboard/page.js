'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import StatCard from '@/components/shared/StatCard';
import PlanCard from '@/components/shared/PlanCard';
import TransactionCard from '@/components/shared/TransactionCard';

// Sample data - replace with real data later
const activePlans = [
  {
    id: 1,
    name: 'Professional',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    usageLimit: 10000,
    usageCount: 4521,
    status: 'active'
  },
  {
    id: 2,
    name: 'Starter',
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    usageLimit: 1000,
    usageCount: 456,
    status: 'active'
  }
];

const purchaseHistory = [
  {
    id: 'INV-001',
    planName: 'Professional',
    date: '2024-01-15',
    amount: 79.00,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-001',
    credits: 1000
  },
  {
    id: 'INV-002',
    planName: 'Starter',
    date: '2024-01-20',
    amount: 29.00,
    status: 'Completed',
    paymentMethod: 'PayPal',
    transactionId: 'TXN-002',
    credits: 500
  },
  {
    id: 'INV-003',
    planName: 'Professional',
    date: '2023-12-15',
    amount: 79.00,
    status: 'Completed',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN-003',
    credits: 2000
  }
];

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to your OTP management portal</p>
          {/* Elegant Gradient Separator */}
          <div className="mt-4">
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent rounded-full"></div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white space-x-2 shadow-lg shadow-indigo-500/30"
        >
          <Icon icon="solar:add-circle-bold-duotone" className="w-5 h-5" />
          <span>Add a new plan</span>
        </motion.button>
      </div>

      {/* Active Plans */}
      <section className="mb-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Active Plans</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor your active subscription plans</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Icon icon="solar:filter-bold-duotone" className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {activePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Purchase History */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Purchase History</h2>
            <p className="text-sm text-gray-500 mt-1">Track your recent transactions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Icon icon="solar:filter-bold-duotone" className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </motion.button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {purchaseHistory.map((purchase) => (
            <TransactionCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      </section>
    </div>
  );
}
