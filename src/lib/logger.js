import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston about the colors
winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create the logger
const logger = winston.createLogger({
  levels,
  format,
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
    // Write to console in development
    process.env.NODE_ENV !== 'production'
      ? new winston.transports.Console()
      : null,
  ].filter(Boolean),
});

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
  write: (message) => logger.http(message.trim()),
};

export { logger, stream };
