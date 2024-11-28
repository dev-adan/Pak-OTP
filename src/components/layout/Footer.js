'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Subscription failed. Please try again.');
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }

      setShowSuccess(true);
      setEmail('');
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      setTimeout(() => {
        setError('');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Documentation', href: '#documentation' },
        { name: 'API Reference', href: '#documentation' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#about' },
        { name: 'Contact', href: '#contact' },
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: 'ri:github-fill', href: 'https://github.com' },
    { name: 'Twitter', icon: 'ri:twitter-x-fill', href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'ri:linkedin-fill', href: 'https://linkedin.com' },
    { name: 'Discord', icon: 'ri:discord-fill', href: 'https://discord.com' },
  ];

  return (
    <footer className="relative overflow-hidden bg-white">
      {/* Gradient divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
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
                <span className="text-xl font-bold text-indigo-600 leading-none">Pak-OTP</span>
                <span className="text-xs text-gray-500">Secure Authentication</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm">
              Empowering businesses with secure, reliable, and user-friendly two-factor authentication solutions.
            </p>
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{social.name}</span>
                  <Icon icon={social.icon} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-base text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-500">
              Subscribe to our newsletter for the latest updates and security insights.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-2 w-full">
              <div className="flex-1 min-w-[300px]">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon icon="material-symbols:mail-outline" className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    className="block w-full pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                  
                  {/* Error message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-8 left-0 right-0 text-center text-red-500 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Success animation */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl border border-green-200"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center space-x-2 text-green-600"
                        >
                          <motion.div
                            initial={{ rotate: -90 }}
                            animate={{ rotate: 0 }}
                            transition={{ type: "spring", damping: 10 }}
                          >
                            <Icon icon="material-symbols:check-circle" className="w-5 h-5" />
                          </motion.div>
                          <span className="text-sm font-medium">Thanks for subscribing!</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Icon icon="material-symbols:send" className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 py-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-center text-gray-400"
          >
            {new Date().getFullYear()} Pak-OTP. All rights reserved. Built with ❤️ for security.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
