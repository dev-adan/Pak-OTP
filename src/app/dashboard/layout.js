'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Logo from '@/components/shared/Logo';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize(); // Initial check
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
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={isMobile ? { x: -300 } : false}
        animate={{ 
          x: isSidebarOpen ? 0 : (isMobile ? -300 : -240),
          width: isSidebarOpen ? (isMobile ? 300 : 240) : 0
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm
          ${isMobile ? 'w-[300px]' : 'w-60'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="h-16 flex items-center justify-between px-4">
            {isSidebarOpen && <Logo />}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Icon 
                icon={isSidebarOpen ? "solar:alt-arrow-left-bold-duotone" : "solar:alt-arrow-right-bold-duotone"} 
                className="w-5 h-5 text-gray-500"
              />
            </button>
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
                  <Icon icon={item.icon} className={`w-6 h-6 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`} />
                  {isSidebarOpen && (
                    <span className="ml-3 font-medium whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Icon icon="solar:hamburger-menu-bold-duotone" className="w-6 h-6 text-gray-500" />
          </button>
          <div className="ml-4">
            <Logo />
          </div>
        </div>
      )}

      {/* Main content */}
      <div 
        className={`
          ${isMobile ? 'ml-0 pt-16' : (isSidebarOpen ? 'ml-60' : 'ml-0')} 
          transition-all duration-300
        `}
      >
        {children}
      </div>
    </div>
  );
}
