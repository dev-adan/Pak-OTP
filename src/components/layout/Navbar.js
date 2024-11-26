'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from '../auth/LoginModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    
    // Close the mobile menu first
    setIsMenuOpen(false);
    
    // Add a small delay to allow the menu to close smoothly
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80; // Height of the fixed navbar
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 relative">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background hexagon */}
                    <motion.path
                      d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                      className="fill-indigo-600"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                    />

                    {/* Fingerprint-inspired curves */}
                    <motion.path
                      d="M35 50 C35 40, 50 40, 50 50 C50 60, 65 60, 65 50"
                      className="fill-none stroke-white stroke-[3]"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                    <motion.path
                      d="M30 45 C30 35, 50 35, 50 45 C50 55, 70 55, 70 45"
                      className="fill-none stroke-white stroke-[3]"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                    <motion.path
                      d="M40 55 C40 45, 50 45, 50 55 C50 65, 60 65, 60 55"
                      className="fill-none stroke-white stroke-[3]"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.7 }}
                    />

                    {/* Key hole */}
                    <motion.circle
                      cx="50"
                      cy="45"
                      r="6"
                      className="fill-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: 1 }}
                    />
                    <motion.path
                      d="M46 45 L54 45 L50 60 Z"
                      className="fill-white"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: 1.2 }}
                    />

                    {/* Glowing effect */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="35"
                      className="fill-none stroke-white/30 stroke-[2]"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: [0, 0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-bold text-indigo-600 leading-none">Pak-OTP</span>
                  <span className="text-xs md:text-sm text-gray-500 font-medium">Secure Authentication</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <button
                onClick={(e) => scrollToSection('features', e)}
                className="text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
              >
                Features
              </button>
              <button
                onClick={(e) => scrollToSection('pricing', e)}
                className="text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
              >
                Pricing
              </button>
              <button
                onClick={(e) => scrollToSection('documentation', e)}
                className="text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg"
              >
                Integrations
              </button>
              <motion.button
                onClick={() => setIsLoginModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={(e) => scrollToSection('features', e)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  Features
                </button>
                <button
                  onClick={(e) => scrollToSection('pricing', e)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  Pricing
                </button>
                <button
                  onClick={(e) => scrollToSection('documentation', e)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  Integrations
                </button>
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
