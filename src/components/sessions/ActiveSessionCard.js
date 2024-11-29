// 'use client';

// import { Icon } from '@iconify/react';
// import { formatDistanceToNow } from 'date-fns';
// import { motion } from 'framer-motion';

// export default function ActiveSessionCard({ session, onLogout }) {
//   const deviceInfo = session.deviceInfo;
//   const isCurrentSession = session.isCurrentSession;

//   // Animation variants
//   const cardVariants = {
//     initial: { opacity: 0, scale: 0.9 },
//     animate: { opacity: 1, scale: 1 },
//     hover: { 
//       scale: 1.02,
//       transition: { duration: 0.2 }
//     }
//   };

//   const glowVariants = {
//     initial: { opacity: 0 },
//     animate: { opacity: [0.5, 0.15, 0.5], transition: { duration: 2, repeat: Infinity } }
//   };

//   const iconVariants = {
//     initial: { rotate: 0, scale: 1 },
//     hover: { 
//       rotate: 360, 
//       scale: 1.1,
//       transition: { duration: 0.5 } 
//     }
//   };

//   const buttonVariants = {
//     initial: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
//     hover: { 
//       backgroundColor: 'rgba(239, 68, 68, 0.2)',
//       transition: { duration: 0.2 }
//     }
//   };

//   // Get appropriate icon and color based on device type
//   const getDeviceIcon = () => {
//     const type = (deviceInfo?.device || '').toLowerCase();
//     if (type.includes('mobile') || type.includes('phone')) return 'material-symbols:phone-android';
//     if (type.includes('tablet')) return 'material-symbols:tablet';
//     return 'material-symbols:computer';
//   };

//   // Format date to relative time with tooltip
//   const formatDate = (date) => {
//     const formattedDate = new Date(date).toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//     return {
//       relative: formatDistanceToNow(new Date(date), { addSuffix: true }),
//       full: formattedDate
//     };
//   };

//   const lastAccessedTime = formatDate(session.lastAccessed);
//   const createdTime = formatDate(session.createdAt);

//   return (
//     <motion.div
//       variants={cardVariants}
//       initial="initial"
//       animate="animate"
//       whileHover="hover"
//       className="relative w-full sm:w-[340px] h-auto bg-gradient-to-br from-gray-800 to-gray-900 
//                  rounded-2xl overflow-hidden p-5"
//     >
//       {/* Animated background glow */}
//       <motion.div
//         variants={glowVariants}
//         initial="initial"
//         animate="animate"
//         className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
//       />

//       {/* Content container */}
//       <div className="relative space-y-4">
//         {/* Header with device icon and status */}
//         <div className="flex items-start justify-between">
//           <motion.div
//             variants={iconVariants}
//             className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl
//                        shadow-lg shadow-black/20"
//           >
//             <Icon 
//               icon={getDeviceIcon()}
//               className="text-indigo-400"
//               width={24}
//               height={24}
//             />
//           </motion.div>

//           {isCurrentSession && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 0.2 }}
//               className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
//                          bg-green-500/20 border border-green-500/30"
//             >
//               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
//               <span className="text-xs text-green-400 font-medium">Current</span>
//             </motion.div>
//           )}
//         </div>

//         {/* Device Info Section */}
//         <div className="space-y-4">
//           {/* Browser and OS */}
//           <div>
//             <h3 className="text-lg font-semibold text-gray-100 mb-1">
//               {deviceInfo?.browser || 'Unknown Browser'}
//             </h3>
//             <div className="flex items-center gap-2 text-sm text-gray-400">
//               <Icon icon="ph:desktop-bold" className="w-4 h-4" />
//               <span>{deviceInfo?.os || 'Unknown OS'}</span>
//             </div>
//           </div>

//           {/* IP Address */}
//           <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg">
//             <Icon icon="ph:globe-bold" className="w-4 h-4 text-indigo-400" />
//             <span>{session.ipAddress || 'Unknown IP'}</span>
//           </div>

//           {/* Time Information */}
//           <div className="space-y-2">
//             {/* Last Accessed */}
//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               <Icon icon="ph:clock-bold" className="w-3.5 h-3.5" />
//               <span title={lastAccessedTime.full}>
//                 Last active {lastAccessedTime.relative}
//               </span>
//             </div>
//             {/* Created At */}
//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               <Icon icon="ph:calendar-bold" className="w-3.5 h-3.5" />
//               <span title={createdTime.full}>
//                 Created {createdTime.relative}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         {!isCurrentSession && (
//           <motion.button
//             onClick={() => onLogout(session.id)}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="group p-2 rounded-xl transition-colors duration-200 
//                      hover:bg-red-500/20 focus:outline-none focus:ring-2 
//                      focus:ring-red-500/40 focus:ring-offset-1 focus:ring-offset-gray-800"
//           >
//             <motion.div 
//               whileHover={{ rotate: 180 }}
//               transition={{ duration: 0.3 }}
//             >
//               <Icon
//                 icon="solar:logout-2-bold"
//                 className="w-5 h-5 text-red-400 group-hover:text-red-300"
//               />
//             </motion.div>
//           </motion.button>
//         )}
//       </div>
//     </motion.div>
//   );
// }
