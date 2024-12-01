'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';
import LogoutConfirmModal from '@/components/settings/LogoutConfirmModal';

export default function Settings() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/?showLogin=true');
    },
  });
  
  // Consolidated loading states
  const [loadingStates, setLoadingStates] = useState({
    sessions: true,
    password: false,
    revoke: false
  });
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [sessions, setSessions] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Password validation states
  const passwordValidation = useMemo(() => {
    const newPassword = formData.newPassword;
    return {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[@$!%*?&]/.test(newPassword),
      matchesConfirm: newPassword === formData.confirmPassword && newPassword !== ''
    };
  }, [formData.newPassword, formData.confirmPassword]);

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const otherSessionsCount = sessions.filter(s => !s.isCurrentSession).length;

  // Fetch sessions when component mounts and session is available
  useEffect(() => {
    if (session) {
      const fetchSessions = async () => {
        try {
          const res = await fetch('/api/auth/sessions');
          const data = await res.json();
          
          if (data.sessions) {
            console.log('Session from next-auth:', session);
            console.log('Session token:', session.token);
            
            const sessionsWithDeviceInfo = data.sessions.map(dbSession => {
              console.log('Processing session:', dbSession);
              return {
                ...dbSession,
                isCurrentSession: dbSession._id === session.sessionId,
                deviceInfo: dbSession.deviceInfo || {
                  browser: 'Unknown Browser',
                  os: 'Unknown OS',
                  device: 'Unknown Device'
                }
              };
            });
            setSessions(sessionsWithDeviceInfo);
          }
        } catch (error) {
          toast.error('Failed to fetch sessions');
          addLog('Failed to fetch active sessions', 'error');
        } finally {
          setLoadingStates(prev => ({ ...prev, sessions: false }));
        }
      };
      fetchSessions();
    }
  }, [session]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    clearLogs();
    
    if (!isPasswordValid) {
      addLog('Please meet all password requirements', 'error');
      toast.error('Please meet all password requirements');
      return;
    }

    if (!formData.currentPassword || !formData.newPassword) {
      addLog('Current password and new password are required', 'error');
      toast.error('All fields are required');
      return;
    }

    try {
      setLoadingStates(prev => ({ ...prev, password: true }));
      addLog('Initiating password change...', 'info');

      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      if (data.success) {
        addLog('✅ Password changed successfully!', 'success');
        toast.success(data.message || 'Password changed successfully');
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(data.error || 'Failed to change password');
      }

    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      toast.error(error.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, password: false }));
      addLog('Password change process completed', 'info');
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      setLoadingStates(prev => ({ ...prev, revoke: true }));
      addLog('Revoking all other sessions...', 'info');

      const res = await fetch('/api/auth/sessions/end-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currentSessionId: session.sessionId 
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to revoke other sessions');
      }

      setIsLogoutModalOpen(false);

      // Refresh the sessions list
      const sessionsRes = await fetch('/api/auth/sessions');
      const sessionsData = await sessionsRes.json();
      
      if (sessionsData.sessions) {
        const sessionsWithDeviceInfo = sessionsData.sessions.map(dbSession => ({
          ...dbSession,
          isCurrentSession: dbSession._id === session.sessionId,
          deviceInfo: dbSession.deviceInfo || {
            browser: 'Unknown Browser',
            os: 'Unknown OS',
            device: 'Unknown Device'
          }
        }));
        setSessions(sessionsWithDeviceInfo);
      }
      
      toast.success(`All other sessions revoked successfully`);
      addLog(`✅ Successfully ended ${data.sessionsEnded} other sessions`, 'success');
    } catch (error) {
      toast.error(error.message);
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, revoke: false }));
    }
  };

  const handleEndSession = async (sessionId) => {
    if (!sessionId) return toast.error('Invalid session');
    
    setLoadingStates(prev => ({ ...prev, revoke: true }));
    try {
      const response = await fetch('/api/auth/sessions/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to end session');
      }

      // Optimistically update UI
      setSessions(prev => prev.filter(s => s._id !== sessionId));
      toast.success('Session ended successfully');
    } catch (error) {
      console.error('Session end error:', error);
      window.location.reload(); // Force refresh on error
    } finally {
      setLoadingStates(prev => ({ ...prev, revoke: false }));
    }
  };

  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    setTooltipPosition({ x: mouseX, y: mouseY });
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getDeviceInfo = (session) => {
    const deviceTypes = {
      mobile: {
        icon: 'solar:smartphone-2-bold-duotone',
        label: 'Mobile Device',
        color: 'indigo'
      },
      tablet: {
        icon: 'solar:tablet-bold-duotone',
        label: 'Tablet',
        color: 'purple'
      },
      desktop: {
        icon: 'solar:monitor-bold-duotone',
        label: 'Desktop',
        color: 'blue'
      }
    };

    const browserIcons = {
      chrome: 'logos:chrome',
      firefox: 'logos:firefox',
      safari: 'logos:safari',
      edge: 'logos:microsoft-edge',
      opera: 'logos:opera',
      default: 'solar:globe-bold-duotone'
    };

    let deviceType = 'desktop';
    const device = session.deviceInfo?.device?.toLowerCase() || '';
    
    if (device.includes('mobile') || device.includes('phone')) {
      deviceType = 'mobile';
    } else if (device.includes('tablet')) {
      deviceType = 'tablet';
    }

    const deviceInfo = deviceTypes[deviceType];
    const browserIcon = browserIcons[session.deviceInfo?.browser?.toLowerCase()] || browserIcons.default;

    return { device: deviceInfo, browserIcon };
  };

  const getBrowserInfo = (browser) => {
    if (!browser) return 'Unknown Browser';
    
    const browserMap = {
      'Firefox': 'Firefox',
      'Chrome': 'Chrome',
      'Safari': 'Safari',
      'Edge': 'Microsoft Edge',
      'Opera': 'Opera'
    };

    const browserName = Object.keys(browserMap).find(name => 
      browser.toLowerCase().includes(name.toLowerCase())
    );

    return browserName ? browserMap[browserName] : browser;
  };

  // Show loading state while session is checked
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center">
              <Icon icon="solar:settings-bold-duotone" className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Loading Settings</h3>
          <p className="text-gray-500">Please wait while we load your settings...</p>
        </div>
      </div>
    );
  }

  // If we get here, we know we're authenticated because of { required: true }
  return (
    <div className="min-h-screen bg-gray-50/30 p-4 mt-16 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your security and account preferences</p>
          <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500/0 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Active Sessions Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-xl">
                      <Icon icon="solar:devices-bold-duotone" className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
                      <p className="text-sm text-gray-500">Real-time session management across your devices</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => otherSessionsCount > 0 && setIsLogoutModalOpen(true)}
                    disabled={otherSessionsCount === 0 || loadingStates.revoke}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Icon icon="solar:logout-3-bold-duotone" className="w-4 h-4" />
                    <span>Sign Out All</span>
                  </motion.button>
                </div>

                <div className="grid gap-4">
                  {loadingStates.sessions ? (
                    <div className="space-y-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="bg-gray-50 rounded-xl p-4 animate-pulse">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-gray-200 rounded w-1/4" />
                              <div className="h-3 bg-gray-200 rounded w-2/3" />
                              <div className="h-3 bg-gray-200 rounded w-1/2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse" />
                        <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center">
                          <Icon icon="solar:devices-bold-duotone" className="w-10 h-10 text-indigo-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Sessions</h3>
                      <p className="text-gray-500">You currently have no active sessions on your account</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sessions.map((session, index) => {
                        const { device, browserIcon } = getDeviceInfo(session);
                        const isActive = session.active || session.current;
                        const lastActiveTime = formatTimeAgo(session.lastAccessed);
                        const createdTime = new Date(session.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                        
                        return (
                          <motion.div 
                            key={session._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                            onMouseEnter={() => {
                              
                              setTooltipVisible(true);
                            }}
                            onMouseLeave={() => {
                              
                              setTooltipVisible(false);
                            }}
                            onMouseMove={handleMouseMove}
                          >
                            {/* Tooltip */}
                            {tooltipVisible && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ 
                                  opacity: 1,
                                  scale: 1,
                                  transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                  }
                                }}
                                style={{
                                  position: 'fixed',
                                  left: `${tooltipPosition.x + 15}px`,
                                  top: `${tooltipPosition.y + 15}px`,
                                  zIndex: 9999,
                                  pointerEvents: 'none'
                                }}
                                className="w-[280px] bg-white rounded-xl shadow-xl shadow-indigo-500/10 
                                         border border-indigo-100 overflow-hidden transform origin-top-left"
                              >
                                <div className="p-4 space-y-3">
                                  {/* IP Address */}
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                      <Icon icon="solar:ip-bold-duotone" className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-500">IP Address</div>
                                      <div className="text-sm text-gray-900">{session?.ipAddress || 'Unknown'}</div>
                                    </div>
                                  </div>

                                  {/* Created At */}
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg">
                                      <Icon icon="solar:calendar-bold-duotone" className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-500">Created</div>
                                      <div className="text-sm text-gray-900">{createdTime}</div>
                                    </div>
                                  </div>

                                  {/* Last Access */}
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                      <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-500">Last Access</div>
                                      <div className="text-sm text-gray-900">{lastActiveTime}</div>
                                    </div>
                                  </div>
                                </div>
                                 
                                {/* Elegant bottom border */}
                                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                              </motion.div>
                            )}

                            {/* Main Content */}
                            <div className="relative flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 
                                        hover:border-indigo-200 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50/30 
                                        transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/10">
                              <div className="flex items-center space-x-4">
                                {/* Device Icon with Effects */}
                                <div className="relative">
                                  <div className={`absolute inset-0 bg-gradient-to-br from-${isActive ? 'indigo' : 'gray'}-500 to-${isActive ? 'indigo' : 'gray'}-400 rounded-lg opacity-10 group-hover:animate-pulse`} />
                                  <div className="relative p-3 xs:p-4 bg-white rounded-lg shadow-sm">
                                    <div className="relative">
                                      <Icon 
                                        icon={device.icon || (device.type === 'mobile' ? 'solar:smartphone-bold-duotone' : 'solar:desktop-bold-duotone') }
                                        className={`w-7 h-7 xs:w-8 xs:h-8 text-${isActive ? 'indigo' : 'gray'}-600`}
                                      />
                                      {isActive && (
                                        <motion.div 
                                          animate={{ scale: [1, 1.2, 1] }}
                                          transition={{ duration: 2, repeat: Infinity }}
                                          className="absolute -top-1 -right-1"
                                        >
                                          <div className="w-2.5 h-2.5 xs:w-3 xs:h-3 bg-green-500 rounded-full">
                                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                                          </div>
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Device Info */}
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="font-medium text-gray-900">
                                      {device.name || session.deviceInfo?.os || 'Unknown Device'}
                                    </h3>
                                    {session.isCurrentSession && (
                                      <motion.span 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                      >
                                        This Device
                                      </motion.span>
                                    )}
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs xs:text-sm text-gray-500">
                                    {/* Browser Info */}
                                    <div className="flex items-center space-x-1.5">
                                      <Icon icon={browserIcon} className="w-4 h-4" />
                                      <span>{session.deviceInfo?.browser || 'Unknown Browser'}</span>
                                    </div>
                                    {/* OS Info */}
                                    <div className="flex items-center space-x-1.5">
                                      <Icon 
                                        icon={session.os?.toLowerCase().includes('windows') ? 'ri:windows-fill' : 
                                             session.os?.toLowerCase().includes('mac') ? 'ri:apple-fill' : 
                                             session.os?.toLowerCase().includes('linux') ? 'ri:ubuntu-fill' : 
                                             'solar:laptop-bold-duotone'} 
                                        className="w-4 h-4" 
                                      />
                                      <span>{session.deviceInfo?.os || 'Unknown OS'}</span>
                                    </div>
                                    {/* Last Active */}
                                    <div className="flex items-center space-x-1.5">
                                      <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4" />
                                      <span>Active {formatTimeAgo(session.lastAccessed)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                {!session.isCurrentSession && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleEndSession(session._id)}
                                    disabled={loadingStates.revoke}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                  >
                                    <Icon 
                                      icon="solar:logout-2-bold-duotone" 
                                      className="w-5 h-5" 
                                    />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Session Stats with Animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  {/* Security Level */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100/50"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon icon="solar:shield-check-bold-duotone" className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-900">Security Level</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-indigo-600">High</p>
                      <span className="text-xs text-indigo-400">/ 100%</span>
                    </div>
                  </motion.div>

                  {/* Active Devices */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100/50"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon icon="solar:devices-bold-duotone" className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">Active Devices</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-purple-600">{sessions.length}</p>
                      <span className="text-xs text-purple-400">devices</span>
                    </div>
                  </motion.div>

                  {/* Last Update */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon icon="solar:clock-circle-bold-duotone" className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">Last Update</span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-lg font-bold text-blue-600">Just Now</p>
                      <span className="text-xs text-blue-400">real-time</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Password Change Section */}
            <ChangePasswordForm 
              formData={formData}
              handleInputChange={handleInputChange}
              handlePasswordChange={handlePasswordChange}
              passwordValidation={passwordValidation}
              isPasswordValid={isPasswordValid}
              loadingStates={loadingStates}
            />
          </div>

          {/* Activity Log - Right Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden lg:sticky lg:top-24">
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-xl">
                      <Icon icon="solar:history-bold-duotone" className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
                      <p className="text-sm text-gray-500">Recent account activity</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearLogs}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon icon="solar:eraser-bold-duotone" className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {logs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-xl text-sm ${
                        log.type === 'success' ? 'bg-green-50 text-green-700' :
                        log.type === 'error' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{log.message}</span>
                        <span className="text-xs opacity-70">{log.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                  {logs.length === 0 && (
                    <div className="text-center py-8">
                      <Icon icon="solar:clipboard-list-bold-duotone" className="w-12 h-12 mx-auto text-gray-300" />
                      <p className="text-gray-500 mt-2">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutAllSessions}
        sessionsCount={otherSessionsCount}
        isLoading={loadingStates.revoke}
      />
    </div>
  );
}
