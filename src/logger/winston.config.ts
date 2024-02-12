import { utilities, WinstonModule } from 'nest-winston';
import winstonDaily from 'winston-daily-rotate-file';
import winston from 'winston';
import appRoot from 'app-root-path';
import dayjs from 'dayjs';

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = dayjs().tz(opts.tz).format();
  }
  return info;
});

// 로그 저장 파일 옵션
const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD', // 날짜 포맷 지정
    dirname: `${appRoot.path}/logs` + `/${level}`, // 저장할 URL
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, // 30일의 로그 저장
    zippedArchive: true, // 로그가 쌓였을 때 압축
    colorize: true,
    handleExceptions: true,
    json: false,
  };
};

// 로거 설정
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // 콘솔 출력 옵션 지정
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        utilities.format.nestLike('PLEM', {
          prettyPrint: true,
        })
      ),
    }),
    // info, error, fatal 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('error')),
    new winstonDaily(dailyOptions('fatal')),
  ],
  // 포멧 지정
  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level} ${info.message}`;
    })
  ),
});
