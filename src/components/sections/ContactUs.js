'use client';

import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateEmail } from '@/utils/emailValidation';
import { validateMessage } from '@/utils/messageValidation';
import EmailInput from '@/components/common/EmailInput';
import AIValidationIndicator from '@/components/common/AIValidationIndicator';

const correctDomainTypo = (typo) => {
  const corrections = {
    'gmial': 'gmail',
    'gmal': 'gmail',
    'gmil': 'gmail',
    'gmai': 'gmail',
    'yaho': 'yahoo',
    'yahooo': 'yahoo',
    'hotmal': 'hotmail',
    'hotmai': 'hotmail',
    'outloo': 'outlook',
    'outlok': 'outlook'
  };
  return corrections[typo] || typo;
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailValidation, setEmailValidation] = useState({ isValid: true, error: null });
  const [messageValidation, setMessageValidation] = useState({ isValid: true, error: null });
  const [isValidatingMessage, setIsValidatingMessage] = useState(false);
  const messageValidationTimeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      // Check email validation
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      // Check message validation
      const messageCheck = validateMessage(formData.message);
      if (!messageCheck.isValid) {
        throw new Error(messageCheck.error);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send message');
      }

      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate message on change with debounce
    if (name === 'message') {
      // Reset validation if empty
      if (!value.trim()) {
        setMessageValidation({ isValid: true, error: null });
        setIsValidatingMessage(false);
        if (messageValidationTimeout.current) {
          clearTimeout(messageValidationTimeout.current);
        }
        return;
      }

      setIsValidatingMessage(true);
      
      // Clear previous timeout
      if (messageValidationTimeout.current) {
        clearTimeout(messageValidationTimeout.current);
      }

      // Set new timeout for validation
      messageValidationTimeout.current = setTimeout(() => {
        const validation = validateMessage(value);
        setMessageValidation(validation);
        setIsValidatingMessage(false);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (messageValidationTimeout.current) {
        clearTimeout(messageValidationTimeout.current);
      }
    };
  }, []);

  const contactInfo = [
    {
      icon: 'material-symbols:location-on',
      title: 'Our Location',
      details: ['123 Business Avenue', 'Tech District, CA 94107']
    },
    {
      icon: 'material-symbols:phone-in-talk',
      title: 'Phone Numbers',
      details: ['+1 (555) 123-4567', '+1 (555) 765-4321']
    },
    {
      icon: 'material-symbols:mail',
      title: 'Email Us',
      details: ['support@pak-otp.com', 'business@pak-otp.com']
    }
  ];

  const socialLinks = [
    { name: 'WhatsApp', icon: 'ri:whatsapp-fill', color: 'text-green-500', hover: 'hover:bg-green-500', link: 'https://wa.me/1234567890' },
    { name: 'LinkedIn', icon: 'ri:linkedin-fill', color: 'text-blue-600', hover: 'hover:bg-blue-600', link: 'https://linkedin.com' },
    { name: 'Twitter', icon: 'ri:twitter-fill', color: 'text-blue-400', hover: 'hover:bg-blue-400', link: 'https://twitter.com' },
    { name: 'GitHub', icon: 'ri:github-fill', color: 'text-gray-800', hover: 'hover:bg-gray-800', link: 'https://github.com' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-40" id="contact">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
        {/* Transition curve */}
        <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-50/30" 
          style={{
            clipPath: "ellipse(70% 100% at 50% 100%)"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-8 mt-16">
              {contactInfo.map((info, index) => (
                <div
                  key={info.title}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-50 p-3 rounded-xl">
                      <Icon icon={info.icon} className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 ${social.color} hover:text-white ${social.hover} transition-all duration-300 shadow-sm hover:shadow-lg`}
                  >
                    <Icon icon={social.icon} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              {/* Success Message with Celebration */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm z-10 p-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 8 }}
                      className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                    >
                      <Icon icon="mdi:check-bold" className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    {/* Confetti effect */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          opacity: 1,
                          scale: 0,
                          x: 0,
                          y: 0
                        }}
                        animate={{ 
                          opacity: 0,
                          scale: 1,
                          x: (Math.random() - 0.5) * 200,
                          y: (Math.random() - 0.5) * 200,
                          rotate: Math.random() * 360
                        }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`absolute w-3 h-3 rounded-full ${
                          ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500'][i % 4]
                        }`}
                      />
                    ))}

                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-gray-900 mb-2 text-center"
                    >
                      Thank You! 🎉
                    </motion.h3>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 text-center max-w-sm"
                    >
                      Your message has been received! We'll be in touch within 24 hours. Looking forward to connecting with you!
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <div className="absolute top-4 left-4 right-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Muhammad Ali"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <EmailInput
                      value={formData.email}
                      onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                      onValidation={setEmailValidation}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon icon="material-symbols:phone" className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        pattern="[0-9+\-\s]*"
                        className="block w-full pl-4 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        placeholder="0336-5555000"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 rounded-lg transition-all duration-200
                        ${messageValidation.error && formData.message.trim().length > 0
                          ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' 
                          : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'
                        }
                        text-gray-900`}
                      placeholder="How can we help you?"
                      required
                    />
                    <AIValidationIndicator
                      isValidating={isValidatingMessage}
                      isValid={messageValidation.isValid && formData.message.length >= 10}
                      error={messageValidation.error}
                      showIndicator={formData.message.length > 0}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !emailValidation.isValid || !messageValidation.isValid}
                  className={`w-full py-3 px-6 text-white rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting || !emailValidation.isValid || !messageValidation.isValid
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
