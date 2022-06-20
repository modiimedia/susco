import { ensureDir, remove } from "fs-extra";
import glob from "fast-glob";
import { isText } from "istextorbinary";
import { convertToHtml, convertToPdf } from "./files";
import Logger from "./logger";

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
  heading: string;
  description?: string;
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
  logger.log(`converting ${files.length} files to PDF`);
  const htmlBlocks: string[] = [];
  for (const file of files) {
    const html = await convertToHtml(file);
    htmlBlocks.push(html);
    logger.log(`converted ${file}`);
  }
  logger.log(`merging PDFs`);
  await convertToPdf(
    config.heading,
    config.description || "",
    files,
    htmlBlocks,
    config.output
  );
  await remove(TEMP_DIR);
  logger.log("finished!");
};
