'use client';

import { Component } from 'react';
import toast from 'react-hot-toast';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.warn('ErrorBoundary caught an error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    });
    
    // Handle dynamic import errors
    if (
      error.name === 'ChunkLoadError' || 
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Failed to load dynamic import')
    ) {
      console.log('Handling chunk/dynamic import error gracefully');
      
      // Show reload message
      toast.error('Failed to load some components. Reloading...', {
        duration: 2000
      });

      // Reload the page after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      return;
    }

    // Handle navigation errors
    if (error.message?.includes('navigation')) {
      console.log('Handling navigation error gracefully');
      toast.error('Navigation failed. Redirecting...', {
        duration: 2000
      });
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
      return;
    }

    // Show error toast for other errors
    toast.error('Something went wrong. Please try again.');
  }

  render() {
    if (this.state.hasError) {
      // For navigation/chunk errors, show loading state
      if (
        this.state.error?.name === 'ChunkLoadError' || 
        this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('navigation') ||
        this.state.error?.message?.includes('Failed to load dynamic import')
      ) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Reloading...</p>
          </div>
        );
      }

      // For other errors, render fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
