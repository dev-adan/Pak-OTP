'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast'; // Import toast

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isResetEmail, setIsResetEmail] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
    name: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = Array(6).fill(0).map(() => useRef(null));

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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    // Add more password requirements if needed
    return null;
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('An error occurred with Google sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    setFieldErrors(prev => ({
      ...prev,
      [name]: false
    }));
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Reset errors
      setFieldErrors({
        email: false,
        password: false,
        name: false
      });

      if (isLogin) {
        setLoading(true);
        
        // Get the callback URL from URL params or use default
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get('callbackUrl') || '/dashboard';
        
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: callbackUrl
        });

        if (result?.error) {
          if (result.error.includes('No user found')) {
            setFieldErrors(prev => ({ ...prev, email: true }));
            const errorMsg = 'No account found with this email. Would you like to sign up instead?';
            setError(errorMsg);
            toast.error(errorMsg);
          } else if (result.error.includes('Invalid password')) {
            setFieldErrors(prev => ({ ...prev, password: true }));
            const errorMsg = 'Incorrect password. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
          } else {
            setError(result.error || 'Login failed. Please try again.');
            toast.error(result.error || 'Login failed. Please try again.');
          }
          setLoading(false);
          return;
        }

        // Success
        toast.success('Login successful!');
        onClose(); // Close modal first
        
        // Small delay to ensure modal is closed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Use router.push for client-side navigation
        if (result.url) {
          window.location.href = result.url;
        } else {
          window.location.href = callbackUrl;
        }
      } else {
        // Handle Sign Up
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Registration failed');
          toast.error(data.error || 'Registration failed');
          return;
        }

        toast.success('OTP sent to your email!');
        setSlideDirection(1);
        setShowOtpScreen(true);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move to next input if value is entered
    if (value && index < 5 && otpInputRefs[index + 1]?.current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if empty
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && otpInputRefs[index - 1]?.current) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // If pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      // Focus the last input after pasting
      otpInputRefs[5].current?.focus();
    } else {
      // If it's a single digit, paste it in the current input and move to next
      const currentIndex = parseInt(e.target.getAttribute('data-index'));
      if (/^\d$/.test(pastedData) && currentIndex < 6) {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[currentIndex] = pastedData;
        setOtpDigits(newOtpDigits);
        
        // Move focus to next input if available
        if (currentIndex < 5) {
          otpInputRefs[currentIndex + 1].current?.focus();
        }
      }
    }
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

  const handleVerifyOtp = async () => {
    try {
      const otp = otpDigits.join('');
      if (!otp || otp.length !== 6) {
        setError('Please enter a valid 6-digit OTP');
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      setLoading(true);
      setError(''); // Clear previous errors

      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          otp: otp
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'OTP verification failed');
        toast.error(data.error || 'OTP verification failed');
        return;
      }

      toast.success('Account created successfully!');
      
      // Log in the user after successful verification
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      router.push('/dashboard');
      router.refresh();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
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
    setOtpDigits(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    onClose();
  };

  const preventScrollBehavior = (e) => {
    // Only prevent scrolling, don't prevent default behavior
    if (e.target) {
      e.target.scrollIntoView = () => {};
    }
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
            className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
              ${isEmailValid ? 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white' : 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200 focus:border-red-500'}
              outline-none shadow-sm text-gray-900 placeholder-gray-400`}
            placeholder="Enter your email"
          />
          {!isEmailValid && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid email address</p>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendCode}
            disabled={!isEmailValid || !resetEmail || loading}
            className={`w-full py-3 sm:py-2.5 mt-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Code'
            )}
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
              className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
                ${passwordError ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'}
                outline-none shadow-sm text-gray-900 placeholder-gray-400`}
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
              className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
                ${passwordError ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'}
                outline-none shadow-sm text-gray-900 placeholder-gray-400`}
              placeholder="Confirm new password"
              minLength={8}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </div>
            ) : (
              'Update Password'
            )}
          </motion.button>
        </form>
      ) : (
        // OTP input section
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                data-index={index}
                onFocus={preventScrollBehavior}
                className={`w-12 h-12 text-center text-xl font-semibold text-gray-900 border-2 rounded-lg transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
              />
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerifyOtp}
            disabled={loading || otpDigits.some(digit => !digit)}
            className={`w-full py-3 sm:py-2.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
              ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </motion.button>
        </div>
      )}

      <button
        onClick={() => {
          setIsResetPassword(false);
          setShowOtpInput(false);
          setShowNewPasswordFields(false);
          setResetEmail('');
          setOtpDigits(['', '', '', '', '', '']);
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

  const renderOtpScreen = () => (
    <motion.div
      key="otp-screen"
      custom={slideDirection}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 z-50 bg-white p-6 rounded-2xl"
      style={{ position: 'relative', minHeight: '100%' }}
    >
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => {
            setSlideDirection(-1);
            setShowOtpScreen(false);
          }}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
          <span>Back to signup</span>
        </button>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icon icon="heroicons:x-mark-20-solid" className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600">
          We've sent a verification code to<br />
          <span className="font-medium text-gray-900">{formData.email}</span>
        </p>
        <button
          onClick={() => {
            setSlideDirection(-1);
            setShowOtpScreen(false);
          }}
          className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
        >
          Change email address?
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              data-index={index}
              onFocus={preventScrollBehavior}
              className={`w-12 h-12 text-center text-xl font-semibold text-gray-900 border-2 rounded-lg transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
            />
          ))}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleVerifyOtp}
          disabled={loading || otpDigits.some(digit => !digit)}
          className={`w-full px-4 py-3 sm:py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75 transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:hover:scale-100 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </div>
          ) : (
            'Verify Email'
          )}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-75"
          >
            Didn't receive the code? Resend
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={preventScrollBehavior}
            onFocus={preventScrollBehavior}
          >
            <AnimatePresence mode="wait" custom={slideDirection}>
              {showOtpScreen ? (
                <motion.div
                  key="otp-screen"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 z-50 bg-white p-6 rounded-2xl"
                  style={{ position: 'relative', minHeight: '100%' }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <button
                      onClick={() => {
                        setSlideDirection(-1);
                        setShowOtpScreen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200"
                    >
                      <Icon icon="heroicons:arrow-left-20-solid" className="w-5 h-5" />
                      <span>Back to signup</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Icon icon="heroicons:x-mark-20-solid" className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Verify your email
                    </h2>
                    <p className="text-gray-600">
                      We've sent a verification code to<br />
                      <span className="font-medium text-gray-900">{formData.email}</span>
                    </p>
                    <button
                      onClick={() => {
                        setSlideDirection(-1);
                        setShowOtpScreen(false);
                      }}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
                    >
                      Change email address?
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-center space-x-3">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          data-index={index}
                          onFocus={preventScrollBehavior}
                          className={`w-12 h-12 text-center text-xl font-semibold text-gray-900 border-2 rounded-lg transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
                        />
                      ))}
                    </div>

                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      onClick={handleVerifyOtp}
                      disabled={loading || otpDigits.some(digit => !digit)}
                      className={`w-full px-4 py-3 sm:py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-75 transition-all duration-200 ease-in-out transform hover:scale-[1.02] disabled:hover:scale-100 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Verifying...
                        </div>
                      ) : (
                        'Verify Email'
                      )}
                    </motion.button>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-center"
                    >
                      <button
                        onClick={handleFormSubmit}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-75"
                      >
                        Didn't receive the code? Resend
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-screen"
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative p-6"
                  style={{ minHeight: '100%' }}
                >
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1"
                  >
                    <Icon icon="heroicons:x-mark-20-solid" className="w-5 h-5" />
                  </button>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isResetPassword ? 'Reset Password' : isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                      {isResetPassword
                        ? 'Enter your email to reset your password'
                        : isLogin
                        ? 'Sign in to your account'
                        : 'Sign up for a new account'}
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 backdrop-blur-md bg-red-50/30 border border-red-100 rounded-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <svg 
                            className="h-5 w-5 text-red-400" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor"
                          >
                            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                            <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex-1 text-sm text-red-600">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                          >
                            {error}
                          </motion.p>
                        </div>
                      </div>
                      <div 
                        className="h-1 bg-gradient-to-r from-red-300/50 to-red-400/50"
                        style={{
                          clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)'
                        }}
                      />
                    </motion.div>
                  )}
                  {!isResetPassword && (
                    <div className="mb-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
                      >
                        <Icon icon="flat-color-icons:google" className="w-5 h-5 mr-2" />
                        Continue with Google
                      </motion.button>

                      <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {isResetPassword ? (
                    renderResetPassword()
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {!isLogin && (
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
                              ${fieldErrors.name ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'}
                              outline-none shadow-sm text-gray-900 placeholder-gray-400`}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
                            ${fieldErrors.email ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'}
                            outline-none shadow-sm text-gray-900 placeholder-gray-400`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200
                            ${fieldErrors.password ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white'}
                            outline-none shadow-sm text-gray-900 placeholder-gray-400`}
                          placeholder={isLogin ? "Enter your password" : "Create a password"}
                          required
                        />
                      </div>

                      {isLogin && (
                        <div className="text-sm">
                          <button
                            type="button"
                            onClick={() => setIsResetPassword(true)}
                            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition-colors duration-200"
                          >
                            Forgot your password?
                          </button>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        onClick={(e) => {
                          e.preventDefault();
                          handleFormSubmit(e);
                        }}
                        className={`w-full flex justify-center py-3 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
                          ${error ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : ''} 
                          ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </div>
                        ) : isLogin ? (
                          'Sign In'
                        ) : (
                          'Sign Up'
                        )}
                      </button>
                    </form>
                  )}
                  <p className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setFieldErrors({
                          email: false,
                          password: false,
                          name: false
                        });
                        setFormData({
                          name: '',
                          email: '',
                          password: ''
                        });
                        setShowOtpScreen(false);
                        setOtpDigits(['', '', '', '', '', '']);
                      }}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
