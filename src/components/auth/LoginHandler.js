'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginHandlerContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    // Check for showLogin parameter and open modal if present
    if (searchParams.get('showLogin') === 'true') {
      window.dispatchEvent(new CustomEvent('openLoginModal'));
      // Remove the showLogin parameter from the URL without refreshing the page
      window.history.replaceState({}, '', '/');
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))?.scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, [searchParams]);

  return null;
}

export default function LoginHandler() {
  return (
    <Suspense fallback={null}>
      <LoginHandlerContent />
    </Suspense>
  );
}
