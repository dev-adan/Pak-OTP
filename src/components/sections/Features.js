'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Curved path for the roadmap
const RoadmapPath = ({ progress }) => (
  <svg className="absolute left-0 w-full h-full hidden lg:block" style={{ top: '-10%' }}>
    <defs>
      <linearGradient id="roadmapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#818CF8', stopOpacity: 0.2 }} />
        <stop offset="50%" style={{ stopColor: '#6366F1', stopOpacity: 0.6 }} />
        <stop offset="100%" style={{ stopColor: '#4F46E5', stopOpacity: 0.2 }} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <motion.path
      d="M0,100 C150,100 150,300 300,300 C450,300 450,500 600,500"
      stroke="url(#roadmapGradient)"
      strokeWidth="4"
      fill="none"
      filter="url(#glow)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: progress }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    {/* Animated particles along the path */}
    {[0, 1, 2, 3].map((i) => (
      <motion.circle
        key={i}
        r="4"
        fill="#6366F1"
        filter="url(#glow)"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0],
          offsetDistance: ["0%", "100%"],
        }}
        transition={{
          duration: 3,
          delay: i * 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </svg>
);

// Background Mesh Grid
const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Gradient Mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50" />
    
    {/* Animated Orbs */}
    <motion.div
      className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
      style={{
        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, 50, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    
    <motion.div
      className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
      style={{
        background: 'radial-gradient(circle at center, rgba(79, 70, 229, 0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, -30, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />

    {/* Grid Pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    {/* Light Streaks */}
    <motion.div
      className="absolute -top-1/2 left-0 w-full h-screen rotate-12 bg-gradient-to-b from-transparent via-indigo-100/20 to-transparent"
      animate={{
        x: ['-100%', '200%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

const features = [
  {
    title: 'Easy Integration',
    description: 'Implement 2FA in minutes with our simple SDK and clear documentation. Support for all major programming languages.',
    color: '#818CF8',
    illustration: (progress) => (
      <motion.svg width="100%" height="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
        {/* Code Window - Static */}
        <motion.rect
          x="60"
          y="60"
          width="240"
          height="240"
          rx="16"
          fill="white"
          stroke="#818CF8"
          strokeWidth="3"
          initial={{ opacity: 0 }}
          animate={{ opacity: progress }}
        />
        {/* Window Header - Static */}
        <motion.rect
          x="60"
          y="60"
          width="240"
          height="50"
          rx="16"
          fill="#818CF8"
          initial={{ opacity: 0 }}
          animate={{ opacity: progress }}
        />
        {/* Window Buttons - Static */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={90 + i * 30}
            cy="85"
            r="8"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress ? 0.8 : 0 }}
          />
        ))}
        {/* Animated Code Lines */}
        <motion.g>
          {/* Import Statement - Typing Animation */}
          <motion.text 
            x="90" 
            y="160" 
            fontSize="20" 
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress ? 1 : 0,
              fill: ["#6366F1", "#818CF8", "#6366F1"]
            }}
            transition={{
              fill: { duration: 2, repeat: Infinity, ease: "linear" }
            }}
          >
            <motion.tspan
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: progress ? [0, 1, 1, 0] : 0 
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.1, 0.9, 1],
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              import SecureAuth from 'auth-sdk'
            </motion.tspan>
          </motion.text>

          {/* Integration Code - Typing Animation */}
          <motion.text 
            x="90" 
            y="200" 
            fontSize="20" 
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress ? 1 : 0,
              fill: ["#818CF8", "#6366F1", "#818CF8"]
            }}
            transition={{
              fill: { duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }
            }}
          >
            <motion.tspan
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: progress ? [0, 1, 1, 0] : 0 
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.1, 0.9, 1],
                repeat: Infinity,
                repeatDelay: 2,
                delay: 0.8
              }}
            >
              const auth = new SecureAuth();
            </motion.tspan>
          </motion.text>

          {/* Verify Code - Typing Animation */}
          <motion.text 
            x="90" 
            y="240" 
            fontSize="20" 
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress ? 1 : 0,
              fill: ["#22C55E", "#16A34A", "#22C55E"]
            }}
            transition={{
              fill: { duration: 2, repeat: Infinity, ease: "linear", delay: 1 }
            }}
          >
            <motion.tspan
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: progress ? [0, 1, 1, 0] : 0 
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.1, 0.9, 1],
                repeat: Infinity,
                repeatDelay: 2,
                delay: 1.6
              }}
            >
              await auth.verify(user);
            </motion.tspan>
          </motion.text>

          {/* Blinking Cursor */}
          <motion.rect
            x="90"
            y="225"
            width="2"
            height="20"
            fill="#22C55E"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: progress ? [0, 1, 0] : 0,
              x: progress ? [90, 300, 90] : 90
            }}
            transition={{
              opacity: {
                duration: 0.8,
                repeat: Infinity,
                repeatDelay: 0.2
              },
              x: {
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear"
              }
            }}
          />
        </motion.g>
      </motion.svg>
    )
  },
  {
    title: 'Secure Technology',
    description: 'Enterprise-grade security with end-to-end encryption, secure key management, and compliance with industry standards.',
    color: '#6366F1',
    illustration: (progress) => (
      <motion.svg width="100%" height="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
        {/* Central Shield */}
        <motion.path
          d="M200 60 L320 120 V220 C320 300 200 340 200 340 C200 340 80 300 80 220 V120 L200 60Z"
          fill="none"
          stroke="#6366F1"
          strokeWidth="6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 1 }}
        />
        {/* Digital Circuit Lines */}
        {[90, 150, 210].map((y, i) => (
          <motion.path
            key={i}
            d={`M120 ${y} H280 ${i === 1 ? 'M200 150 V240' : ''}`}
            stroke="#818CF8"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 0.5 + i * 0.2 }}
          />
        ))}
        {/* Hexagon Pattern */}
        <motion.g>
          {[
            // Center hexagon
            'M200,120 L230,135 L230,165 L200,180 L170,165 L170,135 Z',
            // Top hexagon
            'M200,70 L230,85 L230,115 L200,130 L170,115 L170,85 Z',
            // Bottom hexagon
            'M200,170 L230,185 L230,215 L200,230 L170,215 L170,185 Z',
            // Left hexagon
            'M150,145 L180,160 L180,190 L150,205 L120,190 L120,160 Z',
            // Right hexagon
            'M250,145 L280,160 L280,190 L250,205 L220,190 L220,160 Z',
            // Top-left hexagon
            'M150,95 L180,110 L180,140 L150,155 L120,140 L120,110 Z',
            // Top-right hexagon
            'M250,95 L280,110 L280,140 L250,155 L220,140 L220,110 Z'
          ].map((hexPath, i) => (
            <motion.path
              key={i}
              d={hexPath}
              stroke="#818CF8"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: progress ? 1 : 0,
                opacity: progress ? 1 : 0
              }}
              transition={{
                pathLength: {
                  duration: 2,
                  delay: i * 0.2,
                  ease: [0.4, 0, 0.6, 1],
                  repeat: Infinity,
                  repeatType: "loop",
                  repeatDelay: 1
                },
                opacity: {
                  duration: 1,
                  delay: i * 0.2
                }
              }}
            />
          ))}
          
          {/* Hexagon Connection Points */}
          {[
            [200, 120], // Center
            [200, 70],  // Top
            [200, 170], // Bottom
            [150, 145], // Left
            [250, 145], // Right
            [150, 95],  // Top-left
            [250, 95]   // Top-right
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="#818CF8"
              initial={{ scale: 0 }}
              animate={{ 
                scale: progress ? 1 : 0,
                opacity: progress ? [0.5, 1, 0.5] : 0
              }}
              transition={{
                scale: {
                  duration: 0.5,
                  delay: i * 0.2
                },
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }
              }}
            />
          ))}
        </motion.g>
        {/* Lock Icon */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: progress }}
          transition={{ delay: 1.2 }}
        >
          <motion.rect
            x="170"
            y="240"
            width="60"
            height="50"
            rx="8"
            fill="#6366F1"
          />
          <motion.path
            d="M180 240 V220 A20 20 0 0 1 220 220 V240"
            fill="none"
            stroke="#6366F1"
            strokeWidth="6"
          />
        </motion.g>
      </motion.svg>
    )
  },
  {
    title: '100% Uptime',
    description: 'Highly available infrastructure with redundant systems and global CDN ensures your authentication service never goes down.',
    color: '#4F46E5',
    illustration: (progress) => (
      <motion.svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 360 360" 
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: 'scale(1.2)' }}
      >
        {/* Server Racks with Modern Design */}
        {[0, 1, 2].map((i) => (
          <motion.g key={i}>
            {/* Main Server Frame */}
            <motion.rect
              x={100 + i * 80}
              y="80"
              width="60"
              height="200"
              rx="8"
              fill="white"
              stroke="#4F46E5"
              strokeWidth="2"
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: progress,
                filter: progress ? "drop-shadow(0 0 8px #4F46E540)" : "none"
              }}
              transition={{
                scaleY: { 
                  duration: 1, 
                  delay: i * 0.2,
                  ease: [0.4, 0, 0.6, 1]
                }
              }}
              style={{ originY: 1 }}
            />
            
            {/* Server Status Indicators */}
            {[0, 1, 2, 3].map((j) => (
              <motion.g key={j}>
                <motion.circle
                  cx={115 + i * 80}
                  cy={110 + j * 45}
                  r="5"
                  fill="#22C55E"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: progress ? [0.4, 1, 0.4] : 0,
                    scale: progress ? [0.8, 1.2, 0.8] : 1
                  }}
                  transition={{
                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 + j * 0.1 },
                    scale: { duration: 2, repeat: Infinity, delay: i * 0.2 + j * 0.1 }
                  }}
                />
                <motion.rect
                  x={128 + i * 80}
                  y={105 + j * 45}
                  width="20"
                  height="10"
                  rx="2"
                  fill="#4F46E520"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.2 + j * 0.1 }}
                />
              </motion.g>
            ))}
          </motion.g>
        ))}

        {/* Uptime Performance Graph */}
        <motion.g>
          <motion.path
            d="M80,320 L140,270 L200,290 L260,250 L320,270"
            fill="none"
            stroke="#22C55E"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.5, delay: 1.2 }}
          />
          
          {/* Graph Data Points */}
          {[
            [140, 270], [200, 290], [260, 250], [320, 270]
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="6"
              fill="white"
              stroke="#22C55E"
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ 
                scale: progress ? [0.8, 1.2, 0.8] : 0
              }}
              transition={{
                scale: { duration: 2, delay: 1.5 + i * 0.1, repeat: Infinity }
              }}
            />
          ))}
        </motion.g>

        {/* System Status */}
        <motion.text
          x="180"
          y="40"
          textAnchor="middle"
          fill="#4F46E5"
          fontSize="16"
          fontWeight="500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: progress ? [0.6, 1, 0.6] : 0,
            y: progress ? 0 : -10
          }}
          transition={{
            opacity: { duration: 3, repeat: Infinity },
            y: { duration: 0.5, delay: 0.5 }
          }}
        >
          SYSTEM ONLINE
        </motion.text>
      </motion.svg>
    )
  },
  {
    title: 'Economical',
    description: 'Pay only for what you use with our flexible pricing. No hidden fees, no minimum commitments, and volume-based discounts.',
    color: '#4338CA',
    illustration: (progress) => (
      <motion.svg width="100%" height="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
        {/* Money Growth Chart */}
        <motion.path
          d="M80 320 L80 120 L360 120"
          stroke="#4338CA"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Growth Curve */}
        <motion.path
          d="M80 280 Q180 260 240 180 T360 120"
          stroke="#22C55E"
          strokeWidth="6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 1, delay: 0.8 }}
        />

        {/* Animated Stack of Coins */}
        {[0, 1, 2, 3].map((i) => (
          <motion.g key={i}>
            <motion.circle
              cx="120"
              cy={280 - i * 30}
              r="24"
              fill="#FFD700"
              stroke="#4338CA"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: 1
              }}
              transition={{ 
                duration: 0.5,
                delay: 1 + (i * 0.2)
              }}
            />
            <motion.text
              x="120"
              y={280 - i * 30}
              textAnchor="middle"
              dy=".3em"
              fill="#4338CA"
              fontSize="20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 + (i * 0.2) }}
            >
              $
            </motion.text>
          </motion.g>
        ))}

        {/* Floating Dollar Signs */}
        {[0, 1, 2].map((i) => (
          <motion.text
            key={i}
            x={200 + i * 60}
            y="180"
            fill="#22C55E"
            fontSize="32"
            fontWeight="bold"
            initial={{ y: 180, opacity: 0 }}
            animate={{
              y: [180, 120, 180],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            $
          </motion.text>
        ))}

        {/* ROI Percentage */}
        <motion.text
          x="320"
          y="140"
          fill="#22C55E"
          fontSize="28"
          fontWeight="bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          +ROI
        </motion.text>
      </motion.svg>
    )
  },
  {
    title: 'State of the Art Technology',
    description: 'Built on cutting-edge technology with AI-powered threat detection, real-time monitoring, and adaptive authentication.',
    color: '#3730A3',
    illustration: (progress) => (
      <motion.svg width="100%" height="100%" viewBox="0 0 360 360" preserveAspectRatio="xMidYMid meet">
        {/* Satellite Dish */}
        <motion.path
          d="M160 280 L240 280 L200 200 Z"
          fill="#3730A3"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M140 200 Q200 160 240 200"
          stroke="#3730A3"
          strokeWidth="6"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.8 }}
        />

        {/* Satellite in Orbit */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <motion.path
            d="M120 120 L160 80 L200 120 L160 160 Z"
            fill="#22C55E"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          />
          {/* Satellite Panels */}
          <motion.line
            x1="140"
            y1="120"
            x2="100"
            y2="120"
            stroke="#3730A3"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          />
          <motion.line
            x1="180"
            y1="120"
            x2="220"
            y2="120"
            stroke="#3730A3"
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          />
        </motion.g>

        {/* Signal Waves */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M200 200 Q200 ${160 - i * 30} ${240 + i * 30} ${160 - i * 30}`}
            stroke="#3730A3"
            strokeWidth="4"
            strokeDasharray="8"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        ))}

        {/* Data Packets */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r="8"
            fill="#22C55E"
            filter="url(#glow)"
            initial={{ 
              cx: 200,
              cy: 200,
              scale: 0
            }}
            animate={{
              cx: [200, 240 + i * 30],
              cy: [200, 160 - i * 30],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        ))}

        {/* Binary Data */}
        {[0, 1].map((i) => (
          <motion.text
            key={i}
            x={260 + i * 40}
            y={140 - i * 20}
            fill="#3730A3"
            fontSize="16"
            opacity="0.6"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity
            }}
          >
            {i % 2 ? '1010' : '0101'}
          </motion.text>
        ))}
      </motion.svg>
    )
  }
];

export default function Features() {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set());
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="relative pb-48 pt-11 overflow-hidden">
      <BackgroundGrid />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative"
          >
            <div 
              className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-[280px] md:w-[450px] lg:w-[600px] h-[280px] md:h-[450px] lg:h-[600px] bg-blue-500/5 rounded-full blur-3xl -z-10" 
            />
            <h2 className="flex flex-col md:flex-row items-center justify-center gap-3 text-center mb-6">
              <motion.div
                className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="relative group">
                  <span className="text-[44px] md:text-[54px] lg:text-[64px] tracking-tight font-extrabold bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 text-transparent bg-clip-text leading-none">Why</span>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] md:h-[2.5px] lg:h-[3px] bg-gradient-to-r from-blue-500/0 via-blue-400 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <motion.div 
                  className="relative flex flex-col md:flex-row items-center md:items-baseline gap-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className="text-[44px] md:text-[54px] lg:text-[64px] tracking-tight font-extrabold bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text leading-none mb-1 md:mb-0">Choose</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[52px] md:text-[68px] lg:text-[85px] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 leading-none">
                      Pak-OTP
                    </span>
                    <motion.span
                      className="text-[44px] md:text-[58px] lg:text-[72px] text-indigo-600 font-bold leading-none relative -top-1"
                      animate={{ 
                        rotate: [0, -5, 5, -5, 5, 0],
                        scale: [1, 1.05, 1.05, 1.05, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 4
                      }}
                    >
                      ?
                    </motion.span>
                  </div>
                </motion.div>
              </motion.div>
            </h2>
            <p className="text-xl md:text-[22px] lg:text-2xl font-medium tracking-wide text-gray-600 max-w-2xl mx-auto px-4">
              Enterprise-grade security made simple
              <br className="hidden md:block" />
              <span className="text-blue-600 inline-block mt-1 md:mt-0 md:inline">for developers</span>
            </p>
          </motion.div>
        </div>

        <div className='compatibility relative py-15 md:py-18 lg:py-24'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4"
            >
              Seamless Integration
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Connect with your favorite platforms and services with just a few clicks
            </motion.p>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[
                { name: 'Shopify', icon: 'logos:shopify', color: '#96BF48' },
                { name: 'WordPress', icon: 'logos:wordpress', color: '#21759B' },
                { name: 'Custom Code', icon: 'carbon:code', color: '#4F46E5' },
                { name: 'Other Services', icon: 'carbon:connect', color: '#22D3EE' }
              ].map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 p-8">
                    <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.1 + index * 0.1
                        }}
                        className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 group-hover:scale-110 transition-transform duration-300"
                      >
                        <Icon icon={platform.icon} className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: platform.color }} />
                      </motion.div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{platform.name}</h3>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                        className="h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            />
          </div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="space-y-12 lg:space-y-16 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                viewport={{ once: true, margin: "-100px" }}
                onViewportEnter={() => {
                  setVisibleFeatures(prev => new Set([...prev, index]));
                }}
                className="relative"
              >
                {!isSmallScreen && index < features.length - 1 && (
                  <div className="absolute w-full" style={{ height: '110%', top: '0' }}>
                    <RoadmapPath progress={visibleFeatures.has(index) ? 1 : 0} />
                  </div>
                )}
                
                <div className={`py-6 lg:py-10 flex flex-col lg:flex-row items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} gap-8`}>
                  <div className="flex-1 max-w-xl">
                    <motion.div
                      className="backdrop-blur-md bg-white/60 rounded-2xl shadow-xl p-8 relative overflow-hidden border border-white/20"
                      initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: isSmallScreen ? 0.2 : 0.3 }}
                    >
                      {/* Gradient Orb Background */}
                      <div 
                        className="absolute -top-20 -right-20 w-32 lg:w-40 h-32 lg:h-40 rounded-full"
                        style={{
                          background: `radial-gradient(circle at center, ${feature.color}15, ${feature.color}05)`,
                        }}
                      />
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 relative">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 relative">
                        {feature.description}
                      </p>
                    </motion.div>
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full h-full scale-80 lg:scale-100">
                      {feature.illustration(visibleFeatures.has(index) ? 1 : 0)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gradient transition to Pricing */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-white to-gray-50"></div>
      </div>
    </div>
  );
}
