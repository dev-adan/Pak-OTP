'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", duration: 0.5 }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetEmailChange = (e) => {
    const email = e.target.value;
    setResetEmail(email);
    setIsEmailValid(validateEmail(email));
  };

  const handleSendCode = (e) => {
    e.preventDefault();
    if (validateEmail(resetEmail)) {
      // TODO: Implement send code logic here
      setShowOtpInput(true);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = () => {
    // TODO: Implement actual OTP verification logic here
    if (otp.join('').length === 4) {
      setShowNewPasswordFields(true);
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // TODO: Implement password update logic here
    console.log('Updating password:', newPassword);
    
    // Reset all states and close modal
    setIsResetPassword(false);
    setShowOtpInput(false);
    setShowNewPasswordFields(false);
    setResetEmail('');
    setOtp(['', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const renderResetPassword = () => (
    <div className="space-y-4">
      {!showOtpInput ? (
        // Email input section
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="reset-email"
            value={resetEmail}
            onChange={handleResetEmailChange}
            className={`w-full px-4 py-2 border ${
              isEmailValid ? 'border-gray-300' : 'border-red-500'
            } rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900`}
            placeholder="Enter your email"
          />
          {!isEmailValid && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendCode}
            disabled={!isEmailValid || !resetEmail}
            className={`w-full py-3 px-4 mt-4 ${
              isEmailValid && resetEmail
                ? 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'
                : 'bg-gray-300'
            } text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
          >
            Send Code
          </motion.button>
        </div>
      ) : showNewPasswordFields ? (
        // New password fields section
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900"
              placeholder="Enter new password"
              minLength={8}
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900"
              placeholder="Confirm new password"
              minLength={8}
            />
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Update Password
          </motion.button>
        </form>
      ) : (
        // OTP input section
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900"
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerifyOtp}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            Verify Code
          </motion.button>
        </div>
      )}

      <button
        onClick={() => {
          setIsResetPassword(false);
          setShowOtpInput(false);
          setShowNewPasswordFields(false);
          setResetEmail('');
          setOtp(['', '', '', '']);
          setNewPassword('');
          setConfirmPassword('');
          setPasswordError('');
        }}
        className="w-full text-sm text-indigo-600 hover:text-indigo-500 text-center mt-4"
      >
        Back to Sign In
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon icon="material-symbols:close" className="w-6 h-6" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                    {isResetPassword
                      ? 'Reset Password'
                      : isLogin
                      ? 'Welcome Back!'
                      : 'Create Account'}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {isResetPassword
                      ? 'Enter your email to reset password'
                      : isLogin
                      ? 'Sign in to your account'
                      : 'Start your security journey'}
                  </p>
                </div>

                {isResetPassword ? (
                  renderResetPassword()
                ) : (
                  <>
                    {/* Social Login */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6"
                    >
                      <Icon icon="flat-color-icons:google" className="w-5 h-5" />
                      Continue with Google
                    </motion.button>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-gray-900"
                          placeholder="Enter your password"
                        />
                      </div>

                      {isLogin && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                              Remember me
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsResetPassword(true)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                      >
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </motion.button>
                    </form>

                    {/* Toggle Login/Signup */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        {isLogin ? 'Sign up' : 'Sign in'}
                      </button>
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
