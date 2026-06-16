const dotenv = require('dotenv');

// Load environment variables early
dotenv.config();

// Required environment variables for startup
const requiredEnvs = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
];

// Validate missing variables
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  process.exit(1);
}

// Ensure JWT secrets are sufficiently complex (rudimentary check)
if (process.env.JWT_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: '15m',
    refreshExpiration: '7d',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL,
    adminUrl: process.env.ADMIN_URL || process.env.FRONTEND_URL,
  }
};
