import { ensureDir, remove } from "fs-extra";
import glob from "fast-glob";
import { isText } from "istextorbinary";
import FileConverter from "./fileConverter";
import Logger from "./logger";
import path from "path";

const TEMP_DIR = ".stupid-usco";

const removeLeadingAndTrailingSlashes = (string: string): string =>
  string.trim().replace(/^\/+|\/+$/g, "");

const getFilePaths = async (directory: string, ignore: string[]) => {
  const formattedDir = removeLeadingAndTrailingSlashes(directory);
  console.log(formattedDir);
  const files = await glob(`${formattedDir}/**/*`, {
    ignore,
  });
  return files.filter((file) => isText(file));
};

export interface Config {
  dir: string;
  ignore: string[];
  output: string;
  disableLogs?: boolean;
}

export const defineConfig = (config: Config) => config;

export const generatePdf = async (config: Config) => {
  const logger = new Logger(!config.disableLogs);
  await ensureDir(TEMP_DIR);
  const files = await getFilePaths(config.dir, config.ignore);
  const manager = new FileConverter();
  logger.log(`converting ${files.length} files to PDF`);
  for (const file of files) {
    await manager.convertToPdf(file);
    logger.log(`converted ${file}`);
  }
  logger.log(`merging PDFs`);
  await manager.mergePdfs(config.output);
  await remove(TEMP_DIR);
  logger.log("finished!");
};
