const env = require('./src/config/env'); // Automatically validates env vars
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const cron = require('node-cron');
const syncMediumBlogs = require('./scripts/syncMedium');

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

// CORS configuration (Strict)
const allowedOrigins = [env.cors.frontendUrl, env.cors.adminUrl].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiting (100 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.nodeEnv === 'development' ? 10000 : 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply global limiter to all API routes (specific ones like /login can be overridden later)
app.use('/api', globalLimiter);

let retryCount = 0;
const MAX_RETRIES = 3;

// Database connection with retry logic
const connectWithRetry = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    process.exit(1); // Exit if no MongoDB URI is set
  }

  if (retryCount >= MAX_RETRIES) {
    console.error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts. Please check your connection string and credentials.`);
    process.exit(1); // Exit after max retries
  }

  try {
    await mongoose.connect(env.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    logger.info('Connected to MongoDB Atlas successfully');
    retryCount = 0; // Reset retry count on successful connection
  } catch (err) {
    retryCount++;
    console.error(`MongoDB connection error (attempt ${retryCount}/${MAX_RETRIES}):`, err.message);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in 5 seconds... (${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error('Max retry attempts reached. Please check your MongoDB Atlas connection string and credentials.');
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  if (retryCount < MAX_RETRIES) {
    connectWithRetry();
  }
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  retryCount = 0; // Reset retry count on successful connection
});

// Initial connection
connectWithRetry();

const contentRoutes = require('./src/routes/contentRoutes');

// Medium RSS Sync Cron Job - Runs every day at 2:00 AM
cron.schedule('0 2 * * *', () => {
  logger.info('Running scheduled Medium RSS sync');
  syncMediumBlogs();
});

// Admin manual sync route
app.post('/api/admin/sync-medium', async (req, res) => {
  // Very basic security for manual sync if needed
  const token = req.headers['x-admin-token'];
  if (process.env.ADMIN_SYNC_TOKEN && token !== process.env.ADMIN_SYNC_TOKEN) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  
  try {
    await syncMediumBlogs();
    res.json({ success: true, message: 'Sync completed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Sync failed' });
  }
});

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