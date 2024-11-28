'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useState } from 'react';

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

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative h-full">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        <Icon 
          icon={isMobileMenuOpen ? "solar:close-circle-bold-duotone" : "solar:menu-dots-bold-duotone"} 
          className="w-6 h-6 text-gray-600"
        />
      </button>

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 transform ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
      w-[280px] bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen z-40`}>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center space-x-3">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon 
                  icon={item.icon} 
                  className={`w-6 h-6 ${
                    isActive 
                      ? 'text-indigo-600' 
                      : 'text-gray-500'
                  }`} 
                />
                <span className={`ml-3 font-medium ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'
                    : ''
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Profile */}
        <div className="sticky bottom-0 w-full bg-white border-t border-gray-100">
          <div className="p-4">
            <div 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Icon icon="solar:user-circle-bold-duotone" className="w-6 h-6 text-gray-500" />
              <span className="font-medium text-gray-600">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
