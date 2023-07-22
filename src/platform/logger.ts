import { createLogger, transports, format } from "winston";

const simpleFormat = format.printf(
  (info) => `${info.level}: ${JSON.stringify(info.message)}`,
);

export const logger = createLogger({
  level: "info",
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), simpleFormat),
    }),
    new transports.File({
      filename: "logs/combined.log",
      format: format.json(),
    }),
  ],
});
