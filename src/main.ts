import { ensureDir, remove } from "fs-extra";
import glob from "fast-glob";
import { isText } from "istextorbinary";
import CliProgress from "cli-progress";
import { convertToHtml, convertToPdf } from "./files";
import Logger from "./logger";

const TEMP_DIR = ".stupid-usco";

const removeLeadingAndTrailingSlashes = (string: string): string =>
  string.trim().replace(/^\/+|\/+$/g, "");

const getFilePaths = async (includes: string[], ignore: string[]) => {
  const files = await glob(includes, {
    ignore,
  });
  return files.filter((file) => isText(file));
};

export interface Config {
  heading: string;
  description?: string;
  include: string[];
  ignore: string[];
  output: string;
  disableLogs?: boolean;
}

export const defineConfig = (config: Config) => config;

export const generatePdf = async (config: Config) => {
  const logger = new Logger(!config.disableLogs);
  const progressBar = new CliProgress.SingleBar(
    {},
    CliProgress.Presets.shades_classic
  );
  await ensureDir(TEMP_DIR);
  const files = await getFilePaths(config.include, config.ignore);
  logger.log(`\nprocessing ${files.length} files`);
  progressBar.start(files.length, 0);
  const htmlBlocks: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const html = await convertToHtml(file);
    htmlBlocks.push(html);
    progressBar.update(i + 1);
  }
  progressBar.stop();
  logger.log(`\nmerging files into PDF...`);
  await convertToPdf(
    config.heading,
    config.description || "",
    files,
    htmlBlocks,
    config.output
  );
  await remove(TEMP_DIR);
  logger.log(`${config.output} created`);
};
