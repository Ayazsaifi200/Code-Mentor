/**
 * Configuration settings for the application
 */
module.exports = {
    // Server settings
    server: {
      port: process.env.PORT || 3001,
      environment: process.env.NODE_ENV || 'development',
    },
    
    // Database settings
    database: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-code-mentor',
    },
    
    // JWT Authentication settings
    jwt: {
      secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    
    // Security settings
    security: {
      corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
      maxCodeLength: 5000,
    },
    
    // Code execution settings
    codeExecution: {
      timeoutMs: 10000, // Maximum execution time in milliseconds
      maxMemoryMb: 100, // Maximum memory usage in MB
      allowedLanguages: ['javascript', 'python', 'java'],
    },
  };