'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

export default function PlanCard({ plan }) {
  const router = useRouter();

  // Calculate remaining SMS and percentage
  const remainingSMS = plan.totalSMS - plan.usedSMS;
  const smsUsagePercentage = (plan.usedSMS / plan.totalSMS) * 100;

  const navigateToPlanDetails = () => {
    router.push(`/dashboard/plan/${plan.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
      onClick={navigateToPlanDetails}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Expires on {new Date(plan.expiryDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              plan.apiKey.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {plan.apiKey.status}
            </span>
            <Icon
              icon="material-symbols:chevron-right"
              className="w-6 h-6 text-gray-400"
            />
          </div>
        </div>

        {/* SMS Usage Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>SMS Usage</span>
            <span>{Math.round(smsUsagePercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${smsUsagePercentage}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {plan.usedSMS.toLocaleString()} of {plan.totalSMS.toLocaleString()} SMS used
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-500">Days Left</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {plan.daysLeft}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-500">SMS Left</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {remainingSMS.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
