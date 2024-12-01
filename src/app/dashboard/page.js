'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useSessionValidation } from '@/hooks/useSessionValidation';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );
}

function DashboardContent() {
  const { session, status } = useSessionValidation();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 via-white to-gray-50/50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          {/* Welcome Section - Mobile & Tablet */}
          <div className="lg:hidden relative p-6 rounded-[1.5rem] bg-white shadow-lg overflow-hidden isolate mb-4">
            {/* Gradient Orbs */}
            <div 
              className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: 'translate3d(0, 0, 0)',
              }}
            />
            <div 
              className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: 'translate3d(0, 0, 0)',
              }}
            />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#4F46E5]">Dashboard</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg text-gray-600">Welcome back,</span>
                    <span className="text-lg font-semibold text-[#6366F1]">{session?.user?.name || 'User'}</span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex gap-4">
                  <div className="px-4 py-2 rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/10">
                    <div className="text-sm text-gray-600">Active Plans</div>
                    <div className="text-xl font-semibold text-[#4F46E5]">{activePlans.length}</div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-[#6366F1]/5 border border-[#6366F1]/10">
                    <div className="text-sm text-gray-600">Total Usage</div>
                    <div className="text-xl font-semibold text-[#6366F1]">
                      {activePlans.reduce((total, plan) => total + plan.usageCount, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Cards - Desktop */}
          <div className="hidden lg:grid sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4 xl:gap-6">
            {/* Welcome Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden"
              style={{
                maxWidth: '100%',
                height: 'auto',
                minHeight: '180px'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
              <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
              <p className="text-white/80 font-medium">{session?.user?.name || 'User'}</p>
              <Icon icon="solar:user-circle-bold-duotone" className="absolute bottom-4 right-4 w-12 h-12 text-white/20" />
            </motion.div>

            {/* Active Plans Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white shadow-lg relative overflow-hidden group"
              style={{
                maxWidth: '100%',
                height: 'auto',
                minHeight: '180px'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-[#6366F1]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center">
                    <Icon icon="solar:devices-bold-duotone" className="w-6 h-6 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Active Plans</h3>
                    <p className="text-sm text-gray-500">Current subscriptions</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#4F46E5]">{activePlans.length}</div>
              </div>
            </motion.div>

            {/* Total Usage Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white shadow-lg relative overflow-hidden group"
              style={{
                maxWidth: '100%',
                height: 'auto',
                minHeight: '180px'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-[#6366F1]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                    <Icon icon="solar:graph-new-bold-duotone" className="w-6 h-6 text-[#6366F1]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Total Usage</h3>
                    <p className="text-sm text-gray-500">Across all plans</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#6366F1]">
                  {activePlans.reduce((total, plan) => total + plan.usageCount, 0).toLocaleString()}
                </div>
              </div>
            </motion.div>

            {/* Daily Average Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-white shadow-lg relative overflow-hidden group"
              style={{
                maxWidth: '100%',
                height: 'auto',
                minHeight: '180px'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5]/5 to-[#6366F1]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Icon icon="solar:chart-2-bold-duotone" className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Daily Average</h3>
                    <p className="text-sm text-gray-500">30-day average usage</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-emerald-500">
                  {(activePlans.reduce((total, plan) => total + plan.usageCount, 0) / 30).toFixed(1)}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Active Plans */}
        <Suspense fallback={<LoadingSpinner />}>
          <section className="mb-8">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4F46E5] flex items-center gap-3">
                  <Icon icon="solar:devices-bold-duotone" className="w-8 h-8" />
                  Active Plans
                </h2>
                <div className="mt-2">
                  <div className="text-gray-600 text-base">
                    Track and manage your subscription plans efficiently
                  </div>
                  <div className="h-1 w-32 bg-gradient-to-r from-[#4F46E5]/20 via-[#6366F1]/20 to-transparent rounded-full mt-2"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <Icon icon="solar:filter-bold-duotone" className="w-4 h-4" />
                  <span className="text-sm font-medium">Filter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-white space-x-2 shadow-lg shadow-indigo-500/30"
                >
                  <Icon icon="solar:add-circle-bold-duotone" className="w-5 h-5" />
                  <span>Add a new plan</span>
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {activePlans.map((plan) => (
                <div className="h-full" key={plan.id}>
                  <PlanCard plan={plan} />
                </div>
              ))}
            </div>
          </section>
        </Suspense>

        {/* Purchase History */}
        <Suspense fallback={<LoadingSpinner />}>
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#4F46E5] flex items-center gap-3">
                  <Icon icon="solar:history-bold-duotone" className="w-8 h-8" />
                  Purchase History
                </h2>
                <div className="mt-2">
                  <div className="text-gray-600 text-base">
                    Track your recent transactions
                  </div>
                  <div className="h-1 w-32 bg-gradient-to-r from-[#4F46E5]/20 via-[#6366F1]/20 to-transparent rounded-full mt-2"></div>
                </div>
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
        </Suspense>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { status } = useSessionValidation({
    required: true,
    onUnauthenticated() {
      window.location.href = '/auth/signin';
    },
  });

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
