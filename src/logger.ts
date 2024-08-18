import * as config from './config';
import winston, { format } from 'winston';

const { SPLAT } = require('triple-beam');

const customFormat = format.printf(log => {
  const { level, message, label, timestamp, ms, meta } = log;
  const splat = JSON.stringify(log[SPLAT]) || '';

  if (log instanceof Error) {
    return `${timestamp} [${label}] [${ms}] ${level}: ${message} : ${log.stack} ${splat}`;
  }
  if (meta && meta instanceof Error) {
    return `${timestamp} [${label}] [${ms}] ${level}: ${message} : ${meta.stack} ${splat}`;
  }
  return `${timestamp} [${label}] [${ms}] ${level}: ${message} ${splat}`;
});

const logger = winston.createLogger({
  level: 'verbose',
  format: format.combine(
    format.label({ label: config.get('serviceName') }),
    format.timestamp(),
    format.ms(),
    customFormat
  ),
  defaultMeta: { service: config.get('serviceName') },
  transports: [new winston.transports.Console()]
});

export default logger;
