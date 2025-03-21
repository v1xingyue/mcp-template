import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    targets: [
      {
        level: "info",
        target: "pino-pretty",
        options: {
          colorize: true,
          destination: 2,
        },
      },
    ],
  },
});

export default logger;
