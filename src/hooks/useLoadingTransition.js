'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLoadingTransition() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const startTransition = (href) => {
    setIsLoading(true);
    // Add a small delay to ensure the loading state is visible
    setTimeout(() => {
      router.push(href);
    }, 100);
  };

  return {
    isLoading,
    startTransition,
    setIsLoading
  };
}
