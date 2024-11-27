'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {/* Mobile Overlay */}
      {isMobileView && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-6 mr-2 z-50 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle Sidebar"
      >
        <Icon 
          icon={isSidebarOpen ? "solar:close-circle-bold-duotone" : "solar:menu-dots-bold-duotone"} 
          className="w-5 h-5 text-gray-600"
        />
      </button>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : (isMobileView ? -280 : -64),
          width: isMobileView ? 280 : (isSidebarOpen ? 280 : 80)
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm
          ${isMobileView ? 'shadow-xl' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative flex-shrink-0">
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
              {(isSidebarOpen || isMobileView) && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-indigo-600 leading-none">Pak-OTP</span>
                  <span className="text-xs text-gray-500">Secure Authentication</span>
                </div>
              )}
            </Link>
            {!isMobileView && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <Icon 
                  icon={isSidebarOpen ? "solar:alt-arrow-left-bold-duotone" : "solar:alt-arrow-right-bold-duotone"} 
                  className="w-5 h-5 text-gray-500"
                />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  <Icon 
                    icon={item.icon} 
                    className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} 
                  />
                  {(isSidebarOpen || isMobileView) && (
                    <span className={`ml-3 font-medium transition-opacity duration-200`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-100">
            <div className={`flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
              ${isSidebarOpen || isMobileView ? 'justify-start' : 'justify-center'}`}
            >
              <Icon icon="solar:user-circle-bold-duotone" className="w-6 h-6 text-gray-500 flex-shrink-0" />
              {(isSidebarOpen || isMobileView) && (
                <span className="font-medium text-gray-600">Profile</span>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className={`transition-all duration-300 ${
        isMobileView 
          ? 'ml-0' 
          : (isSidebarOpen ? 'ml-[280px]' : 'ml-20')
      }`}>
        {children}
      </main>
    </div>
  );
}
