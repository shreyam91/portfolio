const { nodeEnv } = require('../config/env');

/**
 * Custom structured JSON logger
 */
const logger = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  error: (message, error = null, meta = {}) => {
    const errorDetails = error ? {
      errorMessage: error.message,
      stack: nodeEnv === 'development' ? error.stack : undefined,
    } : {};

    console.error(JSON.stringify({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...errorDetails,
      ...meta
    }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...meta
    }));
  },
  debug: (message, meta = {}) => {
    if (nodeEnv !== 'production') {
      console.debug(JSON.stringify({
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        ...meta
      }));
    }
  }
};

module.exports = logger;
