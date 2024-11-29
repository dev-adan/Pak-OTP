// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Icon } from '@iconify/react';
// import toast from 'react-hot-toast';
// import ActiveSessionCard from './ActiveSessionCard';

// export default function ActiveSessions() {
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchSessions = async () => {
//     try {
//       const response = await fetch('/api/auth/sessions');
//       if (!response.ok) throw new Error('Failed to fetch sessions');
//       const data = await response.json();
//       setSessions(data);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to load active sessions');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   const handleLogout = async (sessionId) => {
//     try {
//       const response = await fetch(`/api/auth/sessions?sessionId=${sessionId}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to logout session');
      
//       toast.success('Device logged out successfully');
//       fetchSessions(); // Refresh the list
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to logout device');
//     }
//   };

//   const handleLogoutAll = async () => {
//     try {
//       const response = await fetch('/api/auth/sessions?all=true', {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to logout all sessions');
      
//       toast.success('All other devices logged out successfully');
//       fetchSessions(); // Refresh the list
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to logout all devices');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="animate-spin">
//           <Icon icon="eos-icons:loading" width={24} height={24} />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Active Sessions</h2>
//         {sessions.length > 1 && (
//           <button
//             onClick={handleLogoutAll}
//             className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
//           >
//             <Icon icon="material-symbols:logout" />
//             Logout All Other Devices
//           </button>
//         )}
//       </div>

//       <div className="space-y-3">
//         {sessions.length === 0 ? (
//           <p className="text-gray-500 text-center py-4">No active sessions found</p>
//         ) : (
//           sessions.map((session) => (
//             <ActiveSessionCard
//               key={session.id}
//               session={session}
//               onLogout={() => handleLogout(session.id)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
