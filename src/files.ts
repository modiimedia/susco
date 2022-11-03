import { createWriteStream, readFile } from "fs-extra";
import path from "path";
import { format } from "date-fns";
import htmlToPdf from "wkhtmltopdf";
import Prism from "prismjs";
const loadLanguages = require("prismjs/components/");

loadLanguages([
  "markup",
  "html",
  "xml",
  "svg",
  "rss",
  "css",
  "js",
  "actionscript",
  "ada",
  "bash",
  "shell",
  "c",
  "cpp",
  "csharp",
  "cs",
  "dotnet",
  "cmake",
  "elixir",
  "dart",
  "elm",
  "csv",
  "go",
  "gdscript",
  "git",
  "graphql",
  "haxe",
  "ignore",
  "gitignore",
  "java",
  "json",
  "kotlin",
  "kt",
  "lisp",
  "llvm",
  "lua",
  "nginx",
  "php",
  "perl",
  "powershell",
  "pug",
  "python",
  "py",
  "jsx",
  "tsx",
  "rust",
  "ruby",
  "rb",
  "sass",
  "scss",
  "scala",
  "sql",
  "swift",
  "toml",
  "yaml",
  "typescript",
  "ts",
  "tsconfig",
  "zig",
]);

const replaceHtmlCharacters = (str: string) => {
  let result = str
    .replace(/\&/g, "&amp;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;");
  return result;
};

const getHtml = async (
  heading: string,
  description: string,
  listOfFiles: string,
  body: string
) => {
  const html = (
    await readFile(path.resolve(__dirname, "./assets/template.html"))
  ).toString();
  const css = (
    await readFile(path.resolve(__dirname, "./assets/prism.css.copy"))
  ).toString();
  return html
    .replace("{{prismcss}}", css)
    .replace("{{heading}}", heading)
    .replace("{{description_content}}", description)
    .replace("{{listoffiles}}", listOfFiles)
    .replace("{{body}}", body);
};

const getPrismGrammar = (file: string) => {
  const ext = file.split(".").pop() ?? "";
  if (ext === "rs") {
    return Prism.languages.rust;
  }
  const grammar = Prism.languages[ext] ?? Prism.languages.markup;
  return grammar;
};

const getPrismLanguage = (file: string) => {
  const ext = file.split(".").pop() ?? "";
  if (ext === "rs") {
    return "rust";
  }
  return ext;
};

export const convertToHtml = async (file: string) => {
  const text = (await readFile(file)).toString();
  const highlightedText = Prism.highlight(
    text,
    getPrismGrammar(file),
    getPrismLanguage(file)
  );
  const html = `
  <div class="code-section">
    <h2>${file}</h2>
    <div class="code-block">
      <pre><code>${highlightedText}</code></pre>
    </div>
  </div>`;
  return html;
};

export const convertToPdf = async (
  heading: string,
  description: string,
  listOfFiles: string[],
  htmlBlocks: string[],
  output: string
): Promise<void> => {
  const html = await getHtml(
    heading,
    description,
    listOfFiles.map((file) => `<div>- ${file}</div>`).join("\n"),
    htmlBlocks.join("\n")
  );
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(output);
    const now = new Date();
    htmlToPdf(html, {
      pageSize: "Letter",
      footerFontSize: 8,
      footerLeft: `This PDF was generated on ${format(
        now,
        "MMM dd yyyy"
      )} at ${format(
        now,
        "hh:mm a O"
      )} using https://github.com/modiimedia/susco`,
      footerRight: `page [page] of [topage]`,
    }).pipe(writeStream);
    writeStream.on("finish", () => resolve());
    writeStream.on("error", (err) => reject(err));
  });
};
