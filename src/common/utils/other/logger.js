const { createLogger, transports, format } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ timestamp, message }) => {
  return `${timestamp} ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs.log' })
  ]
});

module.exports = logger;