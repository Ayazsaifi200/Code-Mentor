/**
 * Custom error class with status code
 */
class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Error handling middleware
   */
  const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('ERROR 💥', err);
    }
  
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    
    // Programming or unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  };
  
  /**
   * Async handler to avoid try/catch blocks in controllers
   */
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  module.exports = {
    AppError,
    errorHandler,
    asyncHandler,
  };