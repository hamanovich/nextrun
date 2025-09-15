import { consola } from "consola";

const logger = consola.create({
  level: process.env.NODE_ENV === "development" ? 5 : 3,
  formatOptions: {
    columns: 80,
    colors: true,
    compact: false,
    date: true,
  },
});

logger.wrapAll();

export { logger };

export const taggerLogger = (tag: string) => logger.withTag(tag);

if (process.env.NODE_ENV === "test") {
  logger.setReporters([]);
}
