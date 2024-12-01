import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export default function ChangePasswordForm({
  formData,
  handleInputChange,
  handlePasswordChange,
  passwordValidation,
  isPasswordValid,
  loadingStates
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
          <Icon icon="solar:lock-password-bold-duotone" className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          <p className="text-gray-500">Update your password to keep your account secure</p>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-black"
              placeholder="Enter your current password"
            />
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-black"
              placeholder="Enter your new password"
            />
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-black"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50/50 rounded-xl p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <RequirementItem
              text="8+ characters"
              met={passwordValidation.minLength}
            />
            <RequirementItem
              text="Uppercase letter"
              met={passwordValidation.hasUppercase}
            />
            <RequirementItem
              text="Lowercase letter"
              met={passwordValidation.hasLowercase}
            />
            <RequirementItem
              text="Number"
              met={passwordValidation.hasNumber}
            />
            <RequirementItem
              text="Special character"
              met={passwordValidation.hasSpecialChar}
            />
            <RequirementItem
              text="Passwords match"
              met={passwordValidation.matchesConfirm}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={!isPasswordValid || loadingStates.password}
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all
            ${isPasswordValid && !loadingStates.password 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25' 
              : 'bg-gray-300 cursor-not-allowed'}`}
        >
          {loadingStates.password ? (
            <>
              <Icon icon="solar:spinner-bold-duotone" className="w-5 h-5 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <Icon icon="solar:shield-check-bold-duotone" className="w-5 h-5" />
              <span>Update Password</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}

function RequirementItem({ text, met }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${met ? 'bg-emerald-500/10' : 'bg-gray-200'}`}>
        <Icon 
          icon={met ? "solar:check-circle-bold-duotone" : "solar:circle-bold-duotone"} 
          className={`w-4 h-4 ${met ? 'text-emerald-500' : 'text-gray-400'}`} 
        />
      </div>
      <span className={`text-sm ${met ? 'text-gray-700' : 'text-gray-500'}`}>{text}</span>
    </div>
  );
}
