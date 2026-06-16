const { sendError } = require('../utils/apiResponse');
const logger = require('../utils/logger');
const { nodeEnv } = require('../config/env');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  if (err.statusCode === 500) {
    logger.error('Unhandled Exception', err, { path: req.path, method: req.method });
  } else {
    logger.warn('Operational Error', { message: err.message, statusCode: err.statusCode, path: req.path });
  }

  // Handle specific MongoDB errors safely
  if (err.name === 'CastError') {
    return sendError(res, `Invalid ${err.path}: ${err.value}.`, 400);
  }
  if (err.code === 11000) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    return sendError(res, `Duplicate field value: ${value}. Please use another value!`, 400);
  }
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    return sendError(res, 'Invalid input data.', 400, errors);
  }
  
  // Zod validation errors
  if (err.name === 'ZodError') {
    const errors = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return sendError(res, 'Validation failed.', 400, errors);
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Your token has expired! Please log in again.', 401);
  }

  // Development vs Production response
  if (nodeEnv === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      stack: err.stack
    });
  }

  // Production safe response
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  // Programming or unknown error: don't leak details
  return sendError(res, 'Something went very wrong!', 500);
};

module.exports = errorHandler;
