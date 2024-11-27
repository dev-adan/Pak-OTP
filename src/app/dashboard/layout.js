'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      icon: 'solar:widget-5-bold-duotone',
      path: '/dashboard'
    },
    {
      name: 'Documentation',
      icon: 'solar:document-text-bold-duotone',
      path: '/dashboard/documentation'
    },
    {
      name: 'Settings',
      icon: 'solar:settings-bold-duotone',
      path: '/dashboard/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4">
            {isSidebarOpen && (
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                      className="fill-indigo-600"
                    />
                    <path
                      d="M35 50 C35 40, 50 40, 50 50 C50 60, 65 60, 65 50"
                      className="fill-none stroke-white stroke-[3]"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-indigo-600 leading-none">Pak-OTP</span>
                  <span className="text-xs text-gray-500">Secure Authentication</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Icon 
                icon={isSidebarOpen ? "solar:alt-arrow-left-bold-duotone" : "solar:alt-arrow-right-bold-duotone"} 
                className="w-5 h-5 text-gray-500"
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon icon={item.icon} className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}>
        {children}
      </div>
    </div>
  );
}
