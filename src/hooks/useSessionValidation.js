'use client';

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useSessionValidation() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const handleLogout = async () => {
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;

      try {
        localStorage.removeItem('user-settings');
        sessionStorage.clear();
        await signOut({ 
          redirect: true,
          callbackUrl: '/?sessionExpired=true'
        });
      } catch (error) {
        // If we're already logging out or redirecting, ignore the error
        if (isMounted && !window.location.pathname.includes('sessionExpired')) {
          console.error('Logout error:', error);
        }
      }
    };

    const validateSession = async () => {
      if (!session?.user || isLoggingOut.current) return;

      try {
        const response = await fetch('/api/auth/sessions/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: session.user.id || session.user._id || session.user.userId 
          }),
        });

        if (!response.ok) {
          if (isMounted) {
            handleLogout();
          }
        }
      } catch (error) {
        // Only show error if we're not already logging out and component is mounted
        if (isMounted && !isLoggingOut.current) {
          console.error('Session validation failed:', error.message);
          handleLogout();
        }
      }
    };

    // Run validation when session changes and status is authenticated
    if (status === 'authenticated' && session?.user) {
      validateSession();
    }

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [session, status]);

  return { session, status };
}
