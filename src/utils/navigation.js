'use client';

// Preload common routes
export const preloadRoutes = () => {
  // No-op for now as we're not using preload
  return Promise.resolve();
};

// Handle navigation
export const navigateWithPreload = async (router, path) => {
  try {
    // Perform the navigation
    await router.push(path);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to window location if router fails
    window.location.href = path;
  }
};
