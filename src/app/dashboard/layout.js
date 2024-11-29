'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import Logo from '@/components/shared/Logo';
import PageTransition from '@/components/shared/PageTransition';

function DashboardContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Handle logout
  const handleLogout = () => {
    // Close any open menus first
    signOut({ callbackUrl: '/' });
  };

  useEffect(() => {
    // Check for invalid session and redirect
    if (status === 'authenticated' && (!session || !session.user)) {
      handleLogout();
    }
  }, [session, status]);

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
    // Set loaded after initial render
    requestAnimationFrame(() => {
      setIsLoaded(true);
    });

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state while checking session or before layout is loaded
  if (status === "loading" || !isLoaded) {
    return <LoadingSpinner />;
  }

  const sidebarWidth = isSidebarOpen ? '280px' : '80px';
  const sidebarStyle = {
    width: sidebarWidth,
    transform: isMobileView && !isSidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
  };

  // Menu items configuration
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'solar:home-2-bold-duotone'
    },
    {
      name: 'Settings',
      path: '/dashboard/settings',
      icon: 'solar:settings-bold-duotone'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backdrop for mobile */}
      {isMobileView && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
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
      <div 
        style={sidebarStyle}
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          isMobileView && !isSidebarOpen ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex items-center">
              <Logo showText={isSidebarOpen || isMobileView} />
            </div>
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
                    <span className={`ml-3 font-medium ${isMobileView && !isSidebarOpen ? 'hidden' : ''}`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className={`relative border-t border-gray-100 p-4 ${!isSidebarOpen && !isMobileView ? 'px-2' : 'px-3'} ${isMobileView && !isSidebarOpen ? 'hidden' : ''}`}>
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
            {isProfileOpen && (isSidebarOpen || isMobileView) && (
              <div className="absolute bottom-full left-0 w-full p-3">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Icon icon="solar:settings-bold-duotone" className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <Icon icon="solar:logout-3-bold-duotone" className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main 
        style={{ marginLeft: !isMobileView ? sidebarWidth : '0' }}
        className="flex-1 transition-all duration-300"
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <>{/* Removed Suspense fallback */}
      <DashboardContent>{children}</DashboardContent>
    </>
  );
}
