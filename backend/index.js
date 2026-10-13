const env = require('./src/config/env'); // Automatically validates env vars
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const { initMediumCron } = require('./src/services/mediumSync');

const app = express();

// Trust proxy for Next.js API route forwarding (fixes express-rate-limit ERR_ERL_UNEXPECTED_X_FORWARDED_FOR)
app.set('trust proxy', 1);

// Debug logging
logger.info('Environment variables loaded successfully', {
  nodeEnv: env.nodeEnv,
  port: env.port
});

// Security HTTP headers
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  env.cors.frontendUrl,
  env.cors.adminUrl,
  'https://www.shreyam.online',
  'https://shreyam.online',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.shreyam.online')
    ) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive for Next.js API proxy and server requests
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiting (100 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.nodeEnv === 'development' ? 10000 : 500,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply global limiter to all API routes
app.use('/api', globalLimiter);

// Serverless-ready MongoDB connection caching
let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    }).then((conn) => {
      logger.info('Connected to MongoDB Atlas successfully');
      initMediumCron();
      return conn;
    }).catch((err) => {
      cachedPromise = null; // Reset so next request retries
      logger.error('Failed to connect to MongoDB Atlas:', err.message);
      throw err;
    });
  }

  return cachedPromise;
};

// Eagerly initiate database connection in background on startup
connectDB().catch((err) => {
  logger.warn('Initial DB connection in progress:', err.message);
});

// Ensure database connection before any API route
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

const contentRoutes = require('./src/routes/contentRoutes');

// Routes
app.use('/api/v1', contentRoutes);       // public
// Error handling middleware
app.use(errorHandler);

// Function to start server with port fallback
const startServer = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', error);
    }
  }
};

const PORT = env.port;
if (process.env.NODE_ENV !== 'production') {
  logger.info(`Attempting to start server on port ${PORT}`);
  startServer(parseInt(PORT)); 
}

// Export for Vercel serverless function
module.exports = app;