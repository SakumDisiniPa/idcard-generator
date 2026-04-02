// Load environment variables from .env files
import dotenv from 'dotenv';

// Load from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Validate required environment variables
const requiredEnvs = ['NEXT_PUBLIC_SECRET_ACCESS_ID'];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingEnvs.join(', ')}`);
}

// Optional warning for blob token
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.warn('⚠️  BLOB_READ_WRITE_TOKEN not set - file uploads will be disabled');
}
