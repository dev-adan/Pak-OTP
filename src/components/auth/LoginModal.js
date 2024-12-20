'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useState, useRef, useEffect } from 'react';
import { validateEmail } from '@/utils/emailValidation';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast'; // Import toast
import EmailInput from '@/components/common/EmailInput';

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
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
  const [emailValidation, setEmailValidation] = useState({ isValid: true, error: null });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = Array(6).fill(0).map(() => useRef(null));
  const [resendTimer, setResendTimer] = useState(0);
  const [resetOtpDigits, setResetOtpDigits] = useState(['', '', '', '', '', '']);
  const resetOtpRefs = Array(6).fill(0).map(() => useRef(null));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const getFormattedError = (errorMessage) => {
    const errorMappings = {
      'CredentialsSignin': 'Invalid email or password. Please try again.',
      'Email already exists': 'An account with this email already exists. Please sign in instead.',
      'Invalid OTP': 'The verification code you entered is incorrect. Please try again.',
      'OTP expired': 'The verification code has expired. Please request a new one.',
      'Email not found': 'No account found with this email address. Please sign up instead.',
      'Password required': 'Please enter your password.',
      'Invalid email format': 'Please enter a valid email address.',
      'Email required': 'Please enter your email address.',
      'Name required': 'Please enter your full name.',
      'Password too short': 'Password must be at least 6 characters long.',
      'Server error': 'Something went wrong. Please try again later.',
      'Network error': 'Unable to connect. Please check your internet connection.',
      'Default': 'An error occurred. Please try again.'
    };

    // Check for specific error patterns
    if (typeof errorMessage === 'string') {
      // Handle NextAuth error messages
      if (errorMessage.includes('CredentialsSignin')) {
        return errorMappings['CredentialsSignin'];
      }
      
      // Return mapped error message if exists, otherwise return the default message
      return errorMappings[errorMessage] || errorMappings['Default'];
    }

    return errorMappings['Default'];
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

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
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    // Add more password requirements if needed
    return null;
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      });
      
      if (result?.error) {
        setError(getFormattedError(result.error));
        return;
      }
      
      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(getFormattedError('Server error'));
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
    setLoading(true);
    setError('');
    setFieldErrors({
      email: false,
      password: false,
      name: false
    });

    try {
      // Form validation
      let hasError = false;
      const newFieldErrors = {
        email: false,
        password: false,
        name: false
      };

      if (!formData.email) {
        newFieldErrors.email = true;
        setError('Please enter your email address to continue');
        hasError = true;
      } else if (!emailValidation.isValid) {
        newFieldErrors.email = true;
        setError(emailValidation.error);
        hasError = true;
      }

      if (!formData.password) {
        newFieldErrors.password = true;
        setError('Please enter your password to continue');
        hasError = true;
      } else if (formData.password.length < 6) {
        newFieldErrors.password = true;
        setError('Your password should be at least 6 characters long');
        hasError = true;
      }

      if (!isLogin && !formData.name) {
        newFieldErrors.name = true;
        setError('Please enter your name so we know what to call you');
        hasError = true;
      }

      setFieldErrors(newFieldErrors);

      if (hasError) {
        setLoading(false);
        return;
      }

      if (isLogin) {
        setLoading(true);
        
        // Get the callback URL from URL params or use default
        const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
        
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl
        });

        if (result?.error) {
          if (result.error.includes('No user found')) {
            setFieldErrors(prev => ({ ...prev, email: true }));
            const errorMsg = 'We couldn\'t find an account with this email. Would you like to sign up instead?';
            setError(errorMsg);
            toast.error(errorMsg);
          } else if (result.error.includes('Invalid password')) {
            setFieldErrors(prev => ({ ...prev, password: true }));
            const errorMsg = 'The password doesn\'t match our records. Please try again or reset your password.';
            setError(errorMsg);
            toast.error(errorMsg);
          } else {
            const errorMsg = 'Sorry, we couldn\'t log you in. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg);
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
        if (result?.url) {
          router.push(result.url);
        } else {
          router.push(callbackUrl);
        }
      } else {
        // Handle Sign Up
        setLoading(true);
        try {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            setError(getFormattedError(data.error || 'Registration failed'));
            toast.error(data.error || 'Registration failed');
            setLoading(false);
            return;
          }

          toast.success('OTP sent to your email!');
          setSlideDirection(1);
          setShowOtpScreen(true);
        } catch (error) {
          setError(getFormattedError(error.message || 'Registration failed'));
          toast.error(error.message || 'Registration failed');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      setError(getFormattedError(error.message));
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

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is 6 digits
    if (!/^\d{6}$/.test(pastedData)) return;

    // Split the pasted string into an array and update state
    const digits = pastedData.split('');
    setOtpDigits(digits);
    
    // Focus the last input
    otpInputRefs[5].current?.focus();
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // If current input is empty and not first input, focus previous input
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index - 1] = '';
        setOtpDigits(newOtpDigits);
        otpInputRefs[index - 1].current?.focus();
      } else if (otpDigits[index]) {
        // If current input has value, clear it
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = '';
        setOtpDigits(newOtpDigits);
      }
    }
    // Handle left arrow
    else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
    // Handle right arrow
    else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs[index + 1].current?.focus();
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const otp = otpDigits.join('');
      if (!otp || otp.length !== 6) {
        setError(getFormattedError('Invalid OTP'));
        toast.error('Please enter a valid 6-digit OTP');
        return;
      }

      setLoading(true);
      setError(''); // Clear previous errors

      // First verify OTP
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          otp: otp
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(getFormattedError(data.error || 'OTP verification failed'));
        toast.error(data.error || 'OTP verification failed');
        return;
      }

      toast.success('Email verified successfully!');
      
      // Get the callback URL from URL params or use default
      const params = new URLSearchParams(window.location.search);
      const callbackUrl = params.get('callbackUrl') || '/dashboard';

      // Log in the user after successful verification
      const result = await signIn('credentials', {
        email: formData.email.toLowerCase(),
        password: formData.password,
        redirect: false,
        callbackUrl,
        userAgent: window.navigator.userAgent,
        ipAddress: await fetch('https://api.ipify.org?format=json')
          .then(res => res.json())
          .then(data => data.ip)
          .catch(() => 'unknown')
      });

      if (result?.error) {
        setError(getFormattedError('Failed to log in after registration. Please try logging in manually.'));
        toast.error('Failed to log in after registration. Please try logging in manually.');
        return;
      }

      // Success - close modal and redirect
      onClose();
      
      // Add a small delay to ensure session is created
      await new Promise(resolve => setTimeout(resolve, 500));
      router.push(result.url || callbackUrl);
    } catch (error) {
      setError(getFormattedError(error.message));
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword) {
      setPasswordError('Please enter your new password');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Your password should be at least 8 characters long for better security');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('The passwords don\'t match. Please make sure they\'re the same');
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

  const handleResendOtp = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (resendTimer > 0) return;
    
    try {
      setLoading(true);
      setError('');

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isResend: true,
          isSignup: !isLogin
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      // Clear OTP fields
      setOtpDigits(['', '', '', '', '', '']);
      // Focus first input
      otpInputRefs[0].current?.focus();
      // Set 60 second cooldown
      setResendTimer(60);
      toast.success('New OTP sent to your email!');
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend OTP');
      setError(getFormattedError(error.message || 'Failed to resend OTP'));
    } finally {
      setLoading(false);
    }
  };

  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      if (!resetEmail) {
        throw new Error('Email required');
      }

      // Validate email format
      if (!isEmailValid) {
        throw new Error('Invalid email format');
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          step: 'initiate'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset code');
      }

      toast.success(data.message || 'Reset code sent to your email');
      setShowOtpInput(true);
      setResendTimer(60);
    } catch (error) {
      toast.error(error.message);
      setError(getFormattedError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResetOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpDigits = [...resetOtpDigits];
    newOtpDigits[index] = value;
    setResetOtpDigits(newOtpDigits);

    if (value && index < 5) {
      resetOtpRefs[index + 1].current?.focus();
    }
  };

  const handleResetOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setResetOtpDigits(digits);
      // Focus the last input
      if (resetOtpRefs[5].current) {
        resetOtpRefs[5].current.focus();
      }
    }
  };

  const handleResetOtpSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const otp = resetOtpDigits.join('');
      if (!otp || otp.length !== 6) {
        throw new Error('Invalid OTP');
      }

      // Store the OTP for later use in final reset step
      sessionStorage.setItem('resetOtp', otp);

      // Verify OTP
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          otp: otp,
          step: 'verify'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      toast.success('Code verified successfully');
      setShowNewPasswordFields(true);
    } catch (error) {
      toast.error(error.message);
      setError(getFormattedError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setPasswordError('');

      if (!newPassword) {
        setPasswordError('Please enter your new password');
        setLoading(false);
        return;
      }

      if (newPassword.length < 8) {
        setPasswordError('Your password should be at least 8 characters long for better security');
        setLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('The passwords don\'t match. Please make sure they\'re the same');
        setLoading(false);
        return;
      }

      // Get the stored OTP
      const otp = sessionStorage.getItem('resetOtp');
      if (!otp || otp.length !== 6) {
        throw new Error('Invalid verification code. Please try again.');
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          otp: otp,
          newPassword: newPassword,
          step: 'reset'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast.success(data.message || 'Password reset successful');
      
      // Clear stored OTP
      sessionStorage.removeItem('resetOtp');
      
      // Reset all states and switch to login
      setIsResetPassword(false);
      setShowOtpInput(false);
      setShowNewPasswordFields(false);
      setResetEmail('');
      setResetOtpDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setIsLogin(true);
    } catch (error) {
      toast.error(error.message);
      setError(getFormattedError(error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetOtp = async () => {
    if (resendTimer > 0) return;
    
    try {
      setResendLoading(true);
      setError('');

      if (!resetEmail) {
        throw new Error('Email required');
      }

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          step: 'initiate'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }

      // Clear OTP fields and reset timer
      setResetOtpDigits(['', '', '', '', '', '']);
      resetOtpRefs[0].current?.focus();
      setResendTimer(60);
      toast.success(data.message || 'New code sent to your email');
    } catch (error) {
      toast.error(error.message);
      setError(getFormattedError(error.message));
    } finally {
      setResendLoading(false);
    }
  };

  const renderResetPassword = () => (
    <motion.div
      key="reset-password"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4 p-6"
    >
      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (showNewPasswordFields) {
            setShowNewPasswordFields(false);
          } else if (showOtpInput) {
            setShowOtpInput(false);
            setResetOtpDigits(['', '', '', '', '', '']);
          } else {
            setIsResetPassword(false);
            setIsLogin(true);
          }
          setError('');
        }}
        className="absolute top-4 left-4 p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Go back"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-sm text-gray-600 mt-1">
          {!showOtpInput 
            ? "Enter your email to receive a reset code" 
            : !showNewPasswordFields 
              ? "Enter the code sent to your email"
              : "Enter your new password"
          }
        </p>
      </div>

      {!showOtpInput ? (
        // Email input form
        <form onSubmit={handleResetEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              value={resetEmail}
              onChange={handleResetEmailChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !resetEmail}
            className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              error ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      ) : !showNewPasswordFields ? (
        // OTP input form
        <form onSubmit={handleResetOtpSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center gap-2">
              {resetOtpDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleResetOtpChange(index, e.target.value)}
                  onPaste={handleResetOtpPaste}
                  ref={resetOtpRefs[index]}
                  className="w-11 h-11 text-center text-xl font-semibold border rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                />
              ))}
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading || resetOtpDigits.some(digit => !digit)}
              className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendResetOtp}
                disabled={resendLoading || resendTimer > 0}
                className="text-sm text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendLoading 
                  ? 'Sending...'
                  : resendTimer > 0 
                    ? `Resend code in ${resendTimer}s` 
                    : 'Resend code'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        // New password form
        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 pr-12"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <Icon 
                  icon={showNewPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} 
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 pr-12"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <Icon 
                  icon={showConfirmPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} 
                  className="w-5 h-5"
                />
              </button>
            </div>
          </div>

          {passwordError && (
            <p className="text-sm text-red-500">{passwordError}</p>
          )}

          <button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="text-center mt-4">
        <div className="space-y-2">
          <button
            onClick={() => {
              setIsResetPassword(false);
              setShowOtpInput(false);
              setShowNewPasswordFields(false);
              setResetEmail('');
              setResetOtpDigits(['', '', '', '', '', '']);
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError('');
              setIsLogin(true);
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Back to Sign In
          </button>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => {
                setIsResetPassword(false);
                setShowOtpInput(false);
                setShowNewPasswordFields(false);
                setResetEmail('');
                setResetOtpDigits(['', '', '', '', '', '']);
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
                setIsLogin(false);
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderOtpScreen = () => (
    <motion.div
      key="otp-screen"
      custom={slideDirection}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 z-50 bg-white p-2 xs:p-3 sm:p-6 rounded-2xl flex flex-col"
      style={{ position: 'relative', minHeight: '100%' }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-8">
        <button
          onClick={() => {
            setSlideDirection(-1);
            setShowOtpScreen(false);
          }}
          className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-200 text-xs sm:text-base"
        >
          <Icon icon="heroicons:arrow-left-bold-duotone" className="w-3 h-3 sm:w-5 sm:h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={onClose}
          className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Icon icon="heroicons:x-mark-20-solid" className="w-3 h-3 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="text-center mb-3 sm:mb-8">
        <div className="xs:hidden">
          <h2 className="text-lg font-bold text-gray-900 leading-tight">
            Verify your email
          </h2>
          <p className="text-xs text-gray-600 mt-0.5">
            Code sent to<br />
            <span className="font-medium text-gray-900">{formData.email}</span>
          </p>
        </div>
        <div className="hidden xs:block">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
            Verify your email
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            We've sent a verification code to<br />
            <span className="font-medium text-gray-900">{formData.email}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setSlideDirection(-1);
            setShowOtpScreen(false);
          }}
          className="mt-1 sm:mt-2 text-[10px] xs:text-xs sm:text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
        >
          Change email address?
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-start space-y-3 sm:space-y-6">
        <div className="flex justify-center gap-1.5 sm:gap-3 mb-8 sm:mb-6">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              data-index={index}
              onFocus={preventScrollBehavior}
              className={`w-[30px] h-[30px] xs:w-[35px] xs:h-[35px] sm:w-11 sm:h-11 text-center text-base xs:text-lg sm:text-xl font-semibold text-gray-900 border rounded-lg transition-all border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:ring-offset-0 p-0 shadow-sm`}
              ref={otpInputRefs[index]}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={loading || otpDigits.some(digit => !digit)}
          className={`w-full px-3 py-2.5 sm:px-4 sm:py-2.5 text-sm sm:text-base text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all
            ${error ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'} 
            ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify Email'
          )}
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={handleResendOtp}
            disabled={loading || resendTimer > 0}
            className="text-[10px] xs:text-xs sm:text-sm text-blue-600 hover:text-blue-700 focus:outline-none disabled:opacity-75 hover:underline cursor-pointer disabled:cursor-not-allowed"
          >
            {resendTimer > 0 
              ? `Resend code in ${resendTimer}s` 
              : "Didn't receive the code? Resend"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors z-50"
                aria-label="Close authentication modal"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {isResetPassword ? (
                renderResetPassword()
              ) : showOtpScreen ? (
                renderOtpScreen()
              ) : (
                <div className="p-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isLogin
                        ? 'Sign in to your account'
                        : 'Sign up for a new account'}
                    </p>
                  </div>
                  <div className="mt-8 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed"
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
                              ${fieldErrors.name ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white text-gray-900'}
                              outline-none shadow-sm text-gray-900 placeholder-gray-400`}
                            required
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <EmailInput
                          value={formData.email}
                          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
                          onValidation={setEmailValidation}
                          placeholder="Enter your email"
                          validateOnChange={false}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-lg transition-all duration-200 pr-12
                              ${fieldErrors.password ? 'border-2 border-red-500 bg-white focus:ring-2 focus:ring-red-200' : 'border border-gray-200 bg-gray-50 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white text-gray-900'}
                              outline-none shadow-sm text-gray-900 placeholder-gray-400`}
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                          >
                            <Icon 
                              icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"} 
                              className="w-5 h-5"
                            />
                          </button>
                        </div>
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
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isLogin ? 'Signing In...' : 'Sending OTP...'}
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
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
