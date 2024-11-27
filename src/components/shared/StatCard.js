'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function StatCard({ 
  icon, 
  iconBgColor = 'bg-indigo-500/10',
  iconColor = 'text-indigo-600',
  title, 
  value, 
  trend = null,
  gradientFrom = 'from-indigo-500/10',
  gradientTo = 'to-purple-500/10'
}) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative p-6 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${iconBgColor}`}>
            <Icon icon={icon} className={`w-6 h-6 ${iconColor}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <Icon icon="solar:arrow-up-bold-duotone" className="w-4 h-4" />
              {trend}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm text-gray-500">{title}</h3>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}
