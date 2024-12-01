'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useCallback, useState } from 'react';

export function useSessionHandler() {
  const { data: session, status } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSessionError = useCallback((error) => {
    const errorMessages = {
      'SESSION_EXPIRED': 'Your session has expired',
      'SESSION_INVALID': 'Your session is no longer valid',
      'NO_ACTIVE_SESSION': 'No active session found',
      'INTERNAL_ERROR': 'An error occurred',
    };

    return errorMessages[error] || 'Please sign in to continue';
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      // Perform all cleanup synchronously
      localStorage.removeItem('user-settings');
      sessionStorage.clear();
      
      // Bundle cleanup operations
      await Promise.all([
        fetch('/api/auth/sessions/cleanup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }),
        signOut({ redirect: false })
      ]);

      // Use immediate redirect
      window.location.href = '/';
    } catch {
      window.location.href = '/';
    }
  }, [isLoggingOut]);

  useEffect(() => {
    if (session?.error && !isLoggingOut) {
      handleLogout();
    }
  }, [session, handleLogout, isLoggingOut]);

  return {
    session,
    status,
    handleLogout,
    isLoggingOut
  };
}
