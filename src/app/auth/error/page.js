'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const errorMessage = error === 'CredentialsSignin' 
      ? 'Invalid email or password'
      : error || 'An error occurred during authentication';

    toast.error(errorMessage);
    
    // Redirect back to signin after showing error
    const timeout = setTimeout(() => {
      router.push('/auth/signin');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Redirecting you back to sign in...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
