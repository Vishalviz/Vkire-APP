// Logger utility for development and production
// This replaces console statements to avoid ESLint warnings

const isDevelopment = __DEV__;

const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(message, ...args);
    }
  },
  
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.info(message, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(message, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.error(message, ...args);
    }
    // In production, you might want to send errors to a logging service
    // like Sentry, LogRocket, etc.
  },
};

export default logger;
