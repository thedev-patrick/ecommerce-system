import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

export function createWinstonLogger(configService: ConfigService) {
  const logDir = configService.get<string>('LOG_DIR');
  const logLevel = configService.get<string>('LOG_LEVEL');

  return winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}] ${message}`;
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.DailyRotateFile({
        dirname: logDir,
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ],
  });
}
