import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pak OTP - Secure Authentication Service',
  description: 'Enterprise-grade OTP authentication service for businesses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
