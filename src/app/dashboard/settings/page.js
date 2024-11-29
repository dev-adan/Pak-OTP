'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import ActiveSessionCard from '../../../components/sessions/ActiveSessionCard';

export default function Settings() {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [sessions, setSessions] = useState([]);
  const [revoking, setRevoking] = useState(false);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/auth/sessions');
        const data = await res.json();
        if (data.sessions) {
          setSessions(data.sessions);
        }
      } catch (error) {
        toast.error('Failed to fetch sessions');
        addLog('Failed to fetch active sessions', 'error');
      }
    };
    fetchSessions();
  }, []);

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
      setLoading(true);
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
      setLoading(false);
      addLog('Password change process completed', 'info');
    }
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      setRevoking(true);
      addLog('Revoking session...', 'info');

      const res = await fetch(`/api/auth/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to revoke session');
      }

      // Refresh sessions list
      const updatedRes = await fetch('/api/auth/sessions');
      const updatedData = await updatedRes.json();
      setSessions(updatedData.sessions || []);

      toast.success('Session revoked successfully');
      addLog('✅ Session revoked successfully', 'success');
    } catch (error) {
      toast.error(error.message);
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setRevoking(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      setRevoking(true);
      addLog('Revoking all sessions...', 'info');

      const res = await fetch('/api/auth/sessions', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to revoke all sessions');
      }

      // Sign out from current session
      signOut({ callbackUrl: '/' });
      
      toast.success('All sessions revoked successfully');
      addLog('✅ All sessions revoked successfully', 'success');
    } catch (error) {
      toast.error(error.message);
      addLog(`❌ Error: ${error.message}`, 'error');
    } finally {
      setRevoking(false);
    }
  };

  // Server-side render
  if (!isClient || status === 'loading') {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loading settings...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account settings and preferences</p>
      </div>

      {/* User Profile Card */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl">
          <div className="bg-white p-6 rounded-2xl">
            <div className="flex items-center space-x-4">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name} 
                  className="w-16 h-16 rounded-full border-2 border-indigo-500"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {session?.user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{session?.user?.name}</h2>
                <p className="text-gray-500">{session?.user?.email}</p>
                <div className="mt-1 flex items-center">
                  <Icon icon="heroicons:badge-check-solid" className="w-5 h-5 text-indigo-500 mr-1" />
                  <span className="text-sm font-medium text-indigo-500">Verified Account</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="bg-gray-900 shadow-xl rounded-2xl p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Active Sessions
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage your active login sessions across different devices
            </p>
          </div>
          
          {sessions.length > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogoutAllSessions}
              disabled={revoking}
              className="flex items-center gap-2 px-4 py-2 rounded-xl 
                       bg-red-500/10 text-red-400 hover:bg-red-500/20
                       transition-colors duration-200 font-medium text-sm"
            >
              <Icon icon="material-symbols:logout" className="w-5 h-5" />
              <span>End All Other Sessions</span>
            </motion.button>
          )}
        </div>

        <div className="relative">
          {sessions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-4"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 
                            flex items-center justify-center">
                <Icon 
                  icon="material-symbols:devices" 
                  className="w-8 h-8 text-gray-500" 
                />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No Active Sessions
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                There are currently no active sessions on your account
              </p>
            </motion.div>
          ) : (
            <>
              {/* Horizontal scroll indicators */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-r from-gray-900 to-transparent z-10" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-full bg-gradient-to-l from-gray-900 to-transparent z-10" />
              
              {/* Scrollable container */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto pb-4 -mx-4 px-4"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4B5563 #1F2937'
                }}
              >
                <div className="flex gap-6 min-w-min">
                  {sessions.map((session, index) => (
                    <motion.div
                      key={session._id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ActiveSessionCard
                        session={session}
                        onLogout={handleLogoutSession}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Password Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
            <Icon icon="heroicons:key" className="w-6 h-6 text-indigo-500" />
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900"
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900"
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Requirements or Update Status */}
            {loading ? (
              <div className="bg-white p-8 rounded-xl text-center space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-20 h-20">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                    {/* Inner spinning ring */}
                    <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
                    {/* Center dot */}
                    <div className="absolute inset-[30%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-gray-600 font-medium">Updating Password...</div>
                <div className="text-sm text-gray-500">Please wait while we securely update your password</div>
              </div>
            ) : logs.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Password Update Status</h3>
                  <button
                    onClick={clearLogs}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      key={index}
                      className={`text-sm p-2 rounded-lg ${
                        log.type === 'error' ? 'bg-red-50 text-red-600' :
                        log.type === 'success' ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {log.message}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl text-sm">
                <h3 className="font-medium text-gray-900 mb-2">Password Requirements:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.minLength ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.minLength ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    Minimum 8 characters
                    {formData.newPassword && !passwordValidation.minLength && (
                      <span className="ml-2 text-xs text-red-500">
                        ({formData.newPassword.length}/8)
                      </span>
                    )}
                  </li>
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.hasUppercase ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    At least one uppercase letter
                  </li>
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.hasLowercase ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    At least one lowercase letter
                  </li>
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.hasNumber ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.hasNumber ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    At least one number
                  </li>
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.hasSpecialChar ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    At least one special character (@$!%*?&)
                  </li>
                  <li className={`flex items-center transition-colors duration-200 ${passwordValidation.matchesConfirm ? 'text-green-600' : 'text-gray-600'}`}>
                    <Icon 
                      icon={passwordValidation.matchesConfirm ? "heroicons:check-circle-solid" : "heroicons:check-circle"} 
                      className={`w-4 h-4 mr-2 ${passwordValidation.matchesConfirm ? 'text-green-500' : 'text-gray-400'}`}
                    />
                    Passwords match
                  </li>
                </ul>
                
                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Password Strength</span>
                      <span className={`text-xs font-medium ${
                        isPasswordValid ? 'text-green-600' : 
                        Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {isPasswordValid ? 'Strong' : 
                         Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'Medium' : 
                         'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isPasswordValid ? 'bg-green-500 w-full' : 
                          Object.values(passwordValidation).filter(Boolean).length >= 3 ? 'bg-yellow-500 w-2/3' : 
                          'bg-red-500 w-1/3'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`mt-4 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Icon icon="eos-icons:loading" className="w-5 h-5 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </motion.button>
          </form>
        </section>

        {/* Security Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            <Icon icon="heroicons:shield-check" className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
              >
                Enable 2FA
              </motion.button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-medium text-gray-900">Active Sessions</h3>
                <p className="text-sm text-gray-500">Manage your active login sessions</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Sign Out All
              </motion.button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
