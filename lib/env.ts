// Safe environment variable access with defaults
export const env = {
  // Public environment variables (available in browser)
  SECRET_ACCESS_ID: process.env.NEXT_PUBLIC_SECRET_ACCESS_ID,

  // Private environment variables (server-only)
  BLOB_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  SERVER_SECRET_ID: process.env.SECRET_ACCESS_ID,

  // Validation helpers
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',

  // Check if auth is properly configured
  hasAuth: !!process.env.NEXT_PUBLIC_SECRET_ACCESS_ID,

  // Check if blob storage is configured
  hasBlobStorage: !!process.env.BLOB_READ_WRITE_TOKEN,
};

// Log environment status (only in development)
if (env.isDevelopment) {
  console.log('🔐 Auth configured:', env.hasAuth);
  console.log('📦 Blob storage configured:', env.hasBlobStorage);
}
