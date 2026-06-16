const dotenv = require('dotenv');

// Load environment variables early
dotenv.config();

const requiredEnvs = [
  'MONGODB_URI',
  'FRONTEND_URL',
];

// Validate missing variables
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

if (missingEnvs.length > 0) {
  process.exit(1);
}

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI,

  cors: {
    frontendUrl: process.env.FRONTEND_URL,
    adminUrl: process.env.ADMIN_URL || process.env.FRONTEND_URL,
  }
};
