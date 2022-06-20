import { createWriteStream, readFile } from "fs-extra";
import path from "path";
import htmlToPdf from "wkhtmltopdf";

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
    await readFile(path.resolve(__dirname, "template.html"))
  ).toString();
  return html
    .replace("{{heading}}", heading)
    .replace("{{description_content}}", description)
    .replace("{{listoffiles}}", listOfFiles)
    .replace("{{body}}", body);
};

export const convertToHtml = async (file: string) => {
  const text = (await readFile(file)).toString();
  const html = `
  <div class="code-section">
    <h2>${file}</h2>
    <div>
      <pre>
        <code>${replaceHtmlCharacters(text)}</code>
      </pre>
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
    htmlToPdf(html, {
      footerFontSize: 4,
      footerLeft: `This PDF was generated on ${new Date().toDateString()} using https://github.com/modiimedia/susco`,
    }).pipe(writeStream);
    writeStream.on("finish", () => resolve());
    writeStream.on("error", (err) => reject(err));
  });
};
