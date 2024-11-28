'use client';

import { useState, useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// Loading component for Suspense
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );
}

function DashboardContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

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

  // If not authenticated, show loading
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // If not authenticated, redirect will happen automatically through middleware
  if (status === "unauthenticated") {
    return null;
  }

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
          x: isSidebarOpen ? 0 : (isMobileView ? -280 : 0),
          width: isMobileView ? 280 : (isSidebarOpen ? 280 : 80)
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm
          ${isMobileView ? 'shadow-xl' : ''}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4">
            <Link href="/" className={`flex items-center ${!isSidebarOpen && !isMobileView ? 'justify-center w-full' : 'space-x-3'}`}>
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
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${!isSidebarOpen ? 'absolute right-0 ml-4' : ''}`}
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
          <nav className={`flex-1 ${!isSidebarOpen && !isMobileView ? 'px-2' : 'px-3'} py-4 space-y-1 overflow-y-auto`}>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center ${!isSidebarOpen && !isMobileView ? 'justify-center px-2' : 'px-3'} py-3 rounded-lg transition-colors ${
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
                    <span className="ml-3 font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className={`relative border-t border-gray-100 p-4 ${!isSidebarOpen && !isMobileView ? 'px-2' : 'px-3'}`}>
            <div 
              className={`flex items-center ${!isSidebarOpen && !isMobileView ? 'justify-center' : 'justify-between'} cursor-pointer`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className={`flex items-center ${!isSidebarOpen && !isMobileView ? 'justify-center' : 'space-x-3'}`}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                {(isSidebarOpen || isMobileView) && (
                  <div className="flex-1 min-w-0 max-w-[160px]">
                    <h3 className="font-medium text-gray-900 truncate text-sm">{session?.user?.name || 'User'}</h3>
                    <p className="text-xs text-gray-500 truncate w-full">
                      {session?.user?.email}
                    </p>
                  </div>
                )}
              </div>
              {(isSidebarOpen || isMobileView) && (
                <Icon 
                  icon={isProfileOpen ? "solar:alt-arrow-up-bold-duotone" : "solar:alt-arrow-down-bold-duotone"} 
                  className="w-5 h-5 text-gray-500"
                />
              )}
            </div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (isSidebarOpen || isMobileView) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-0 w-full p-3"
                >
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Icon icon="solar:settings-bold-duotone" className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Icon icon="solar:logout-3-bold-duotone" className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'}`}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
