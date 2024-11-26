'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function Footer() {
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
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 px-4 py-2 text-base text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter your email"
              />
              <div className="mt-3 sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  Subscribe
                </motion.button>
              </div>
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
