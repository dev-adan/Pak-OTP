'use client';

import { useEffect, useState, Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import { motion } from 'framer-motion';
import Pricing from '@/components/sections/Pricing';
import Documentation from '@/components/sections/Documentation';
import ContactUs from '@/components/sections/ContactUs';
import LoginModal from '@/components/auth/LoginModal';
import LoginHandler from '@/components/auth/LoginHandler';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('openLoginModal', () => setIsLoginModalOpen(true));
    return () => window.removeEventListener('openLoginModal', () => setIsLoginModalOpen(true));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <LoginHandler />
      </Suspense>

      <Navbar onLoginClick={() => window.dispatchEvent(new CustomEvent('openLoginModal'))} />
      
      {/* Main content with scroll animations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <section className="pt-16">
          <Hero />
        </section>

        {/* Features to Pricing transition wrapper */}
        <div className="relative">
          {/* Features Section */}
          <section id="features" className="relative">
            <Features />
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="relative -mt-32 bg-gray-50">
            <div className="relative pt-16">
              <Pricing/>
            </div>
          </section>

          {/* Documentation Section */}
          <div className="relative">
            <Documentation/>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-50/10" />
          </div>

        </div>

        {/* Integrations Section Placeholder */}
        <section id="integrations" className="hidden">
          {/* Integrations component will go here */}
        </section>

        {/* Testimonials Section Placeholder */}
        <section id="testimonials" className="hidden">
          {/* Testimonials component will go here */}
        </section>

        {/* Contact Section */}
        <div className="-mt-24 relative z-11">
          <ContactUs />
        </div>

      </motion.div>

      <Footer />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
