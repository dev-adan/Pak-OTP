export function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
}

export function getNextAuthUrl() {
  const baseUrl = getBaseUrl();
  return baseUrl;
}
