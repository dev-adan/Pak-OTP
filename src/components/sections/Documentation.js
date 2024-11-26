'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Icon } from '@iconify/react';

const documentationContent = {
  Installation: {
    title: 'Installation',
    fileName: 'installation.js',
    content: [
      {
        type: 'command',
        text: 'npm install @pak-otp/auth'
      },
      {
        type: 'result',
        text: [
          '+ @pak-otp/auth@1.0.0',
          'added 42 packages in 3s'
        ]
      },
      {
        type: 'code',
        text: [
          "import { PakOTP } from '@pak-otp/auth'",
          "",
          "const auth = new PakOTP({",
          "  apiKey: 'your-api-key'",
          "});"
        ]
      }
    ]
  },
  Configuration: {
    title: 'Configuration',
    fileName: 'config.js',
    content: [
      {
        type: 'code',
        text: [
          "import { PakOTP } from '@pak-otp/auth'",
          "",
          "const config = {",
          "  apiKey: process.env.PAK_OTP_API_KEY,",
          "  region: 'us-east-1',",
          "  timeout: 30000, // 30 seconds",
          "  retries: 3,",
          "  logging: true",
          "}",
          "",
          "const auth = new PakOTP(config);"
        ]
      }
    ]
  },
  Authentication: {
    title: 'Authentication',
    fileName: 'auth.js',
    content: [
      {
        type: 'code',
        text: [
          "// Generate OTP",
          "const response = await auth.generateOTP({",
          "  userId: 'user123',",
          "  method: 'sms',",
          "  phone: '+1234567890'",
          "});",
          "",
          "// Verify OTP",
          "const result = await auth.verifyOTP({",
          "  userId: 'user123',",
          "  code: '123456'",
          "});"
        ]
      }
    ]
  },
  'API Reference': {
    title: 'API Reference',
    fileName: 'api.js',
    content: [
      {
        type: 'code',
        text: [
          "// Available Methods",
          "",
          "auth.generateOTP(options) // Generate new OTP",
          "auth.verifyOTP(options)   // Verify OTP code",
          "auth.invalidateOTP(userId) // Invalidate active OTP",
          "auth.getStatus(userId)    // Get OTP status",
          "",
          "// Event Listeners",
          "auth.on('otpGenerated', callback)",
          "auth.on('otpVerified', callback)",
          "auth.on('error', callback)"
        ]
      }
    ]
  },
  Examples: {
    title: 'Examples',
    fileName: 'example.js',
    content: [
      {
        type: 'code',
        text: [
          "// Example 1: SMS Authentication",
          "const smsAuth = async () => {",
          "  try {",
          "    // Generate OTP",
          "    await auth.generateOTP({",
          "      userId: 'user123',",
          "      method: 'sms',",
          "      phone: '+1234567890'",
          "    });",
          "",
          "    // Verify OTP",
          "    const result = await auth.verifyOTP({",
          "      userId: 'user123',",
          "      code: '123456'",
          "    });",
          "",
          "    console.log('Verification result:', result);",
          "  } catch (error) {",
          "    console.error('Authentication failed:', error);",
          "  }",
          "};"
        ]
      }
    ]
  }
};

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('Installation');

  return (
    <div id="documentation" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-white/80 to-white/90" />
        
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute left-60 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Documentation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started quickly with our comprehensive documentation and examples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side - Navigation */}
          <div
            className="lg:col-span-1 bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 hover:border-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Start Guide</h3>
              {[ 'Installation', 'Configuration', 'Authentication', 'API Reference', 'Examples' ].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 relative"
          >
            {/* Code Window */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Window Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50/80">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors duration-200" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors duration-200" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors duration-200" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full bg-indigo-100" />
                  <div className="text-sm text-gray-600">{documentationContent[activeTab].fileName}</div>
                </div>
                <div className="w-16" />
              </div>

              {/* Code Content */}
              <div className="p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {documentationContent[activeTab].content.map((item, index) => (
                    <div key={index}>
                      {item.type === 'command' && (
                        <div className="flex items-center space-x-3 text-gray-800">
                          <span className="text-indigo-600">&gt;</span>
                          <span className="font-mono">{item.text}</span>
                        </div>
                      )}
                      {item.type === 'result' && (
                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm border border-gray-100">
                          {item.text.map((line, i) => (
                            <div key={i} className={i === 0 ? "text-green-600" : "text-gray-500"}>
                              {line}
                            </div>
                          ))}
                        </div>
                      )}
                      {item.type === 'code' && (
                        <div className="space-y-2 bg-gray-900 p-4 rounded-lg">
                          {item.text.map((line, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <span className="text-gray-500 select-none">{i + 1}</span>
                              <span className="text-gray-100 font-mono">
                                {line.includes('import') && (
                                  <>
                                    <span className="text-purple-400">import</span>
                                    <span className="text-gray-100"> {line.split('import')[1].split('from')[0]} </span>
                                    <span className="text-purple-400">from</span>
                                    <span className="text-green-400">{line.split('from')[1]}</span>
                                  </>
                                )}
                                {line.includes('const') && !line.includes('import') && (
                                  <>
                                    <span className="text-purple-400">const</span>
                                    <span className="text-blue-400">{line.split('const')[1].split('=')[0]}</span>
                                    <span className="text-gray-100">=</span>
                                    <span className="text-gray-100">{line.split('=')[1]}</span>
                                  </>
                                )}
                                {!line.includes('const') && !line.includes('import') && (
                                  <span className={
                                    line.startsWith('//') ? "text-gray-500" :
                                    line.includes('try') || line.includes('catch') || line.includes('async') ? "text-purple-400" :
                                    line.includes('await') ? "text-purple-400" :
                                    line.includes('function') ? "text-blue-400" :
                                    "text-gray-100"
                                  }>{line}</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Enhanced Floating Elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Documentation Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[ 'Code Examples', 'API Reference', 'Tutorials' ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Glow Effect */}
              <motion.div 
                className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-cyan-500/5 rounded-2xl blur-2xl -z-10"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
              
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-2xl p-6 h-full border border-gray-100">
                {/* Background Illustration */}
                <div className="absolute inset-0">
                  {index === 0 && (
                    <svg className="absolute right-4 top-4 w-32 h-32 text-indigo-100" viewBox="0 0 200 200">
                      <defs>
                        <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818CF8" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M40,120 L80,80 L120,120 L160,80"
                        stroke="url(#codeGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        animate={{
                          pathLength: [0, 1],
                          opacity: [0.2, 1, 0.2],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.1,
                        }}
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="8"
                        fill="#818CF8"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.1,
                        }}
                      />
                      <motion.circle
                        cx="120"
                        cy="120"
                        r="8"
                        fill="#6366F1"
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.1 + 1,
                        }}
                      />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="absolute right-4 top-4 w-32 h-32 text-blue-100" viewBox="0 0 200 200">
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="60"
                        stroke="#60A5FA"
                        strokeWidth="4"
                        fill="none"
                        animate={{
                          rotate: [0, 360],
                          opacity: [0.2, 0.8, 0.2],
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          delay: index * 0.1,
                          ease: "linear",
                        }}
                      />
                      {[...Array(8)].map((_, i) => (
                        <motion.circle
                          key={i}
                          cx={100 + 40 * Math.cos((i * Math.PI) / 4)}
                          cy={100 + 40 * Math.sin((i * Math.PI) / 4)}
                          r="4"
                          fill="#3B82F6"
                          animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [0.8, 1.2, 0.8],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.1 + (i * 0.5),
                          }}
                        />
                      ))}
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="absolute right-4 top-4 w-32 h-32 text-cyan-100" viewBox="0 0 200 200">
                      <motion.rect
                        x="40"
                        y="40"
                        width="120"
                        height="120"
                        fill="none"
                        stroke="#0EA5E9"
                        strokeWidth="4"
                        animate={{
                          opacity: [0.2, 1, 0.2],
                          pathLength: [0, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.1,
                        }}
                      />
                      {[...Array(3)].map((_, i) => (
                        <motion.rect
                          key={i}
                          x="60"
                          y={70 + i * 25}
                          width={60 - i * 15}
                          height="8"
                          fill="#0EA5E9"
                          animate={{
                            scaleX: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.1 + (i * 0.5),
                          }}
                        />
                      ))}
                    </svg>
                  )}
                </div>

                {/* Icon Container */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.1,
                  }}
                  className="relative mb-6 inline-block"
                >
                  <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full" />
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/20">
                    {index === 0 && <Icon icon="carbon:code" className="w-6 h-6 text-indigo-600" />}
                    {index === 1 && <Icon icon="carbon:book" className="w-6 h-6 text-indigo-600" />}
                    {index === 2 && <Icon icon="carbon:education" className="w-6 h-6 text-indigo-600" />}
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <motion.h3
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.1,
                    }}
                    className="text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent mb-2"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${index === 0 ? 'from-indigo-600 via-blue-600 to-cyan-500' : index === 1 ? 'from-blue-600 via-indigo-600 to-blue-500' : 'from-cyan-500 via-blue-600 to-indigo-600'})`
                    }}
                  >
                    {feature}
                  </motion.h3>
                  
                  <p className="text-gray-600 mb-4">
                    {index === 0 && 'Ready-to-use code snippets for quick implementation'}
                    {index === 1 && 'Detailed API documentation with all available methods'}
                    {index === 2 && 'Full step-by-step guides for common use cases'}
                  </p>

                  {/* Code Preview */}
                  <div
                    animate={{
                      opacity: [0, 1, 0],
                      height: ["0px", "auto", "0px"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: index * 0.1 + 1,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gray-900/90 backdrop-blur-xl rounded-lg p-3 font-mono text-sm text-gray-300 border border-gray-800">
                      {index === 0 && '{"method": "auth.verify"}'}
                      {index === 1 && 'GET /api/v1/auth'}
                      {index === 2 && '# Quick start\npak.init()'}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
