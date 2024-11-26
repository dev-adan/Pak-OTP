'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';



// Pre-defined particle positions to avoid hydration mismatch
const particles = [
  { width: 4, height: 4, left: "10%", top: "20%" },
  { width: 3, height: 3, left: "30%", top: "50%" },
  { width: 5, height: 5, left: "60%", top: "30%" },
  { width: 4, height: 4, left: "80%", top: "40%" },
  { width: 3, height: 3, left: "90%", top: "70%" }
];





// Background Mesh Component
const BackgroundMesh = React.memo(({isSmallScreen}) => {


  // Animation variants for BackgroundMesh
const meshVariants = {
  gradient: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: animate => ({
      scale: animate.scale,
      opacity: animate.opacity,
      transition: {
        duration: animate.duration,
        repeat: isSmallScreen ? 0 : Infinity,
        ease: "easeInOut",
        delay: animate.delay || 0
      }
    })
  },
  particles: {
    hidden: { opacity: 0, y: 0 },
    visible: {
      y: [0, -20, 0],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 3,
        repeat: isSmallScreen ? 0 : Infinity,
        ease: "easeInOut"
      }
    }
  },
  lightStreak: {
    hidden: { x: '-100%' },
    visible: {
      x: ['100%', '200%'],
      transition: {
        duration: 8,
        repeat: isSmallScreen ? 0 : Infinity,
        ease: "linear"
      }
    }
  }
};

  return (<div className="absolute inset-0 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80" />
    
    {/* Animated gradient orbs */}
    <motion.div
      variants={meshVariants.gradient}
      custom={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        duration: 8
      }}
      initial="hidden"
      animate="visible"
      className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] rounded-full"
      style={{
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
    />
    
    <motion.div
      variants={meshVariants.gradient}
      custom={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.4, 0.2],
        duration: 10,
        delay: 1
      }}
      initial="hidden"
      animate="visible"
      className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
      style={{
        background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }}
    />

    {/* Grid pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Floating particles */}
    {particles.map((particle, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-indigo-500/30"
        style={{
          width: `${particle.width}px`,
          height: `${particle.height}px`,
          left: particle.left,
          top: particle.top,
          filter: 'blur(1px)',
        }}
        variants={meshVariants.particles}
        initial="hidden"
        animate="visible"
        transition={{
          delay: i * 0.2
        }}
      />
    ))}

    {/* Light streaks */}
    <motion.div
      className="absolute -top-1/2 left-0 w-full h-screen rotate-12 bg-gradient-to-b from-transparent via-indigo-100/20 to-transparent"
      variants={meshVariants.lightStreak}
      initial="hidden"
      animate="visible"
    />
  </div>
)});

export default function Hero() {
  const [isAnimating] = React.useState(true);
  const [isSmallScreen] = React.useState(() => {
    return window.innerWidth < 800;
});

  // Animation variants for main Hero component
  const heroVariants = {
    svg: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    deviceGroup: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    serverGroup: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    authFlow: {
      hidden: { pathLength: 0, opacity: 0 },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 2.5,
          repeat:0 ,
          repeatDelay: 4.5,
          ease: "easeInOut"
        }
      }
    },
    arrowHead: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
          repeat:  0,
          repeatDelay: 4.5,
          ease: "easeInOut"
        }
      }
    },
    successState: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: [0, 0, 1],
        scale: [0.8, 0.8, 1],
        transition: { duration: 0.5, delay: 3.5 }
      }
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-4 sm:pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.h1 
                className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="block">Secure your users with</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Modern 2FA Solution
                </span>
              </motion.h1>
              <motion.p 
                className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Protect your applications with our enterprise-grade two-factor authentication service. 
                Easy to integrate, powerful to use, and secure by design.
              </motion.p>
              <motion.div 
                className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="rounded-md shadow">
                  <Link
                    href="#contact"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="#features"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <BackgroundMesh  isSmallScreen={isSmallScreen}/>
        <div className="h-[360px] w-full sm:h-[500px] md:h-[600px] lg:w-full lg:h-full relative overflow-hidden">
          <div className="h-full w-full flex items-center justify-center">
          <motion.svg
  width="100%"
  height="100%"
  viewBox={isSmallScreen ? "0 0 800 800" : "0 0 800 700"}
  initial="hidden"
  animate="visible"
  variants={heroVariants.svg}
  className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl transform scale-125"
  style={{ willChange: 'transform' }}
>
              {/* User Device */}
              <motion.g
                variants={heroVariants.deviceGroup}
              >
                {/* Device Frame */}
                <rect
                  x="100"
                  y="200"
                  width="200"
                  height="300"
                  rx="10"
                  fill="#EEF2FF"
                  stroke="#6366F1"
                  strokeWidth="2"
                />
                {/* Device Screen */}
                <rect
                  x="110"
                  y="210"
                  width="180"
                  height="280"
                  rx="5"
                  fill="white"
                  stroke="#E0E7FF"
                  strokeWidth="1"
                />

                {/* Login Form */}
                <motion.g
                  initial={{ opacity: 1, x: 0 }}  
                  animate={isAnimating ? { opacity: 0, x: -180 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 2.5 }} //login form duration
                >
                  {/* Form Title */}
                  <text
                    x="200"
                    y="260"
                    textAnchor="middle"
                    fill="#312E81"
                    fontSize="17"
                    fontWeight="bold"
                  >
                    Login
                  </text>
                  
                  {/* Username Field */}
                  <rect
                    x="125"
                    y="290"
                    width="150"
                    height="30"
                    rx="4"
                    fill="#F3F4F6"
                    stroke="#6366F1"
                    strokeWidth="1.5"
                  />
                  <text
                    x="135"
                    y="310"
                    fill="#4338CA"
                    fontSize="14"
                  >
                    pakotp@pakotp.com
                  </text>

                  {/* Password Field */}
                  <rect
                    x="125"
                    y="330"
                    width="150"
                    height="30"
                    rx="4"
                    fill="#F3F4F6"
                    stroke="#6366F1"
                    strokeWidth="1.5"
                  />
                  <text
                    x="135"
                    y="350"
                    fill="#4338CA"
                    fontSize="14"
                  >
                    ••••••••
                  </text>

                  {/* Sign In Button */}
                  <rect
                    x="125"
                    y="380"
                    width="150"
                    height="35"
                    rx="4"
                    fill="#4338CA"
                  />
                  <text
                    x="200"
                    y="402"
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Sign In
                  </text>
                </motion.g>

                {/* OTP Form */}
                <motion.g
                  initial={{ opacity: 0, x: 180 }}
                  animate={isAnimating ? 
                    { opacity: [0, 1, 1, 0], x: [180, 0, 0, -180] } : 
                    { opacity: 0, x: 180 }
                  }
                  transition={{ 
                    duration: 4,
                    delay: 2.5, //otp form duration
                    times: [0, 0.2, 0.8, 1]
                  }}
                >
                  {/* OTP Title */}
                  <text
                    x="200"
                    y="260"
                    textAnchor="middle"
                    fill="#312E81"
                    fontSize="18"
                    fontWeight="bold"
                  >
                    Enter OTP
                  </text>

                  {/* OTP Fields Container */}
                  <motion.g transform="translate(125, 300)">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.g
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 + (i * 0.1) }}
                      >
                        <rect
                          x={i * 26}
                          y="0"
                          width="22"
                          height="35"
                          rx="4"
                          fill="#F3F4F6"
                          stroke="#6366F1"
                          strokeWidth="1"
                        />
                        <text
                          x={i * 26 + 11}
                          y="23"
                          textAnchor="middle"
                          fill="#312E81"
                          fontSize="15"
                          fontWeight="bold"
                        >
                          {i}
                        </text>
                      </motion.g>
                    ))}
                  </motion.g>

                  {/* Verify Button */}
                  <rect
                    x="125"
                    y="380"
                    width="150"
                    height="35"
                    rx="4"
                    fill="#4338CA"
                  />
                  <text
                    x="200"
                    y="402"
                    textAnchor="middle"
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Verify OTP
                  </text>
                </motion.g>

                {/* Success State */}
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isAnimating ? 
                    { opacity: [0, 0, 1], scale: [0.8, 0.8, 1] } : 
                    { opacity: 0, scale: 0.8 }
                  }
                  transition={{ duration: 2, delay: 4.5 }}
                >
                  {/* Success Icon Container */}
                  <motion.g transform="translate(200, 320)">
                    {/* Success Icon */}
                    <circle
                      cx="0"
                      cy="0"
                      r="40"
                      fill="#34D399"
                      opacity="0.2"
                    />
                    <motion.path
                      d="M-15 0 L-5 15 L20 -10"
                      stroke="#059669"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={isAnimating ? { 
                        pathLength: 1,
                        transition: {
                          type: "spring",
                          duration: 0.8,
                          delay: 2.5,
                          bounce: 0.3
                        }
                      } : { pathLength: 0 }}
                    />
                  </motion.g>
                  
                  {/* Success Text */}
                  <text
                    x="200"
                    y="390"
                    textAnchor="middle"
                    fill="#047857"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    Authenticated
                  </text>
                </motion.g>
              </motion.g>

              {/* Server */}
              <motion.g
                variants={heroVariants.serverGroup}
              >
                {/* Server Frame */}
                <rect
                  x="500"
                  y="200"
                  width="200"
                  height="300"
                  rx="10"
                  fill="white"
                  stroke="#6366F1"
                  strokeWidth="2"
                />
                <rect
                  x="520"
                  y="220"
                  width="160"
                  height="260"
                  rx="5"
                  fill="#EEF2FF"
                  strokeDasharray="5,5"
                  stroke="#6366F1"
                  strokeWidth="1"
                />
                {/* Pak-OTP Logo in Server */}
                <motion.g
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { delay: 0.5 } }
                  }}
                >
                  {/* Logo and text container - centered in server */}
                  <motion.g transform="translate(520, 300)">
                    {/* Background rectangle for better visibility */}
                    <rect
                      x="-10"
                      y="-15"
                      width="180"
                      height="50"
                      rx="8"
                      fill="#EEF2FF"
                      stroke="#6366F1"
                      strokeWidth="1"
                    />
                    
                    {/* Logo and text wrapper for better alignment */}
                    <motion.g transform="translate(5, 10)">
                      {/* Logo */}
                      <motion.g transform="translate(0, -20) scale(0.35)">
                        {/* Background hexagon */}
                        <motion.path
                          d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                          fill="#6366F1"
                        />
                        {/* Fingerprint-inspired curves */}
                        <path
                          d="M35 50 C35 40, 50 40, 50 50 C50 60, 65 60, 65 50"
                          className="stroke-white stroke-[3] fill-none"
                        />
                        <path
                          d="M30 45 C30 35, 50 35, 50 45 C50 55, 70 55, 70 45"
                          className="stroke-white stroke-[3] fill-none"
                        />
                        <path
                          d="M40 55 C40 45, 50 45, 50 55 C50 65, 60 65, 60 55"
                          className="stroke-white stroke-[3] fill-none"
                        />
                        {/* Key hole */}
                        <circle
                          cx="50"
                          cy="45"
                          r="6"
                          fill="white"
                        />
                        <path
                          d="M46 45 L54 45 L50 60 Z"
                          fill="white"
                        />
                      </motion.g>
                      
                      {/* Company Name next to logo */}
                      <motion.g transform="translate(40,-3)">
                        <text
                          x="0"
                          y="0"
                          fill="#4338CA"
                          fontSize="18"
                          fontWeight="bold"
                          fontFamily="Arial, sans-serif"
                          letterSpacing="0.5"
                        >
                          Pak-OTP
                        </text>
                        <text
                          x="2"
                          y="15"
                          fill="#6366F1"
                          fontSize="9"
                          fontFamily="Arial, sans-serif"
                          letterSpacing="1"
                        >
                          SECURE AUTH
                        </text>
                      </motion.g>
                    </motion.g>
                  </motion.g>
                </motion.g>
              </motion.g>

              {/* Authentication Flow Arrows */}
              <motion.g
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { delay: 1, staggerChildren: 0.3 }
                  }
                }}
              >
                {/* Login Request */}
                <motion.path
                  d="M 300 250 L 500 250"
                  stroke="#6366F1"
                  strokeWidth="2"
                  fill="none"
                  variants={{
                    ...heroVariants.authFlow,
                    visible: {
                      ...heroVariants.authFlow.visible,
                      transition: {
                        ...heroVariants.authFlow.visible.transition,
                        duration: 2.5,
                        delay : 0.3, // Override only the duration
                      }
                    }
                  }}
                />
                <motion.polygon
                  points="495,245 505,250 495,255"
                  fill="#6366F1"
                  variants={{
                    ...heroVariants.arrowHead,
                    visible: {
                      ...heroVariants.arrowHead.visible,
                      transition: {
                        ...heroVariants.arrowHead.visible.transition,
                        duration: 0.1,
                        delay : 2.5, // Override only the duration
                      }
                    }
                  }}
                />

                {/* 2FA Code */}
                <motion.path
                  d="M 500 350 L 300 350"
                  stroke="#4F46E5"
                  strokeWidth="2"
                  fill="none"
                  variants={{
                    ...heroVariants.authFlow,
                    visible: {
                      ...heroVariants.authFlow.visible,
                      transition: {
                        ...heroVariants.authFlow.visible.transition,
                        duration: 1,
                        delay : 1.7, // Override only the duration
                      }
                    }
                  }}
                />
                <motion.polygon
                  points="305,345 295,350 305,355"
                  fill="#4F46E5"
                  variants={{
                    ...heroVariants.arrowHead,
                    visible: {
                      ...heroVariants.arrowHead.visible,
                      transition: {
                        ...heroVariants.arrowHead.visible.transition,
                        duration: 0.1,
                        delay : 3, // Override only the duration
                      }
                    }
                  }}
                />

                {/* Verification */}
                <motion.path
                  d="M 300 450 L 500 450"
                  stroke="#4338CA"
                  strokeWidth="2"
                  fill="none"
                  variants={{
                    ...heroVariants.authFlow,
                    visible: {
                      ...heroVariants.authFlow.visible,
                      transition: {
                        ...heroVariants.authFlow.visible.transition,
                        duration: 1.3,
                        delay : 4, // Override only the duration
                      }
                    }
                  }}
                />
        
                <motion.polygon
                  points="495,445 505,450 495,455"
                  fill="#4338CA"
                  variants={{
                    ...heroVariants.arrowHead,
                    visible: {
                      ...heroVariants.arrowHead.visible,
                      transition: {
                        ...heroVariants.arrowHead.visible.transition,
                        duration: 0.1,
                        delay : 5, // Override only the duration
                      }
                    }
                  }}
                />
              </motion.g>

              {/* Labels */}
              <motion.g
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { delay: 0.5 }
                  }
                }}
              >
                <text x="150" y="180" fill="#4F46E5" fontSize="14" fontWeight="500">User Device</text>
                <text x="550" y="180" fill="#4F46E5" fontSize="14" fontWeight="500">Auth Server</text>
                <text x="350" y="230" fill="#6366F1" fontSize="12">1. Login Request</text>
                <text x="350" y="330" fill="#4F46E5" fontSize="12">2. 2FA Code</text>
                <text x="350" y="430" fill="#4338CA" fontSize="12">3. Verification</text>
              </motion.g>

            </motion.svg>
          </div>
        </div>
      </div>
    </div>
  );
}