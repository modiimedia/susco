import { createWriteStream, ensureFile, readFile, writeFile } from "fs-extra";
import path from "path";
import htmlToPdf from "wkhtmltopdf";
import glob from "fast-glob";
import PDFMerger from "pdf-merger-js";

class FileConverter {
  fileCount = 0;
  htmlTemplate = "";
  footerHtmlTemplate = `<html>
  <body>
    <div>
      This pdf was generated using
      <a href="https://github.com/ModiiMedia/stupid-usco">
        https://github.com/ModiiMedia/stupid-usco
      </a>
    </div>
  </body>
</html>
`;
  tempDir = ".stupid-usco";

  async getHtml(heading: string, body: string) {
    if (!this.htmlTemplate) {
      this.htmlTemplate = (
        await readFile(path.resolve(__dirname, "template.html"))
      ).toString();
    }
    return this.htmlTemplate
      .replace("{{heading}}", heading)
      .replace("{{body}}", body);
  }

  getPdfFilename() {
    this.fileCount++;
    return `${this.tempDir}/${this.fileCount}.pdf`;
  }

  async convertToPdf(file: string): Promise<void> {
    try {
      const text = (await readFile(file)).toString();
      const html = await this.getHtml(file, text);
      return new Promise((resolve, reject) => {
        const writeStream = createWriteStream(this.getPdfFilename());
        htmlToPdf(html, {
          footerLeft:
            "This PDF was generated using https://github.com/modiimedia/stupid-usco",
        }).pipe(writeStream);
        writeStream.on("finish", () => resolve());
        writeStream.on("error", (err) => reject(err));
      });
    } catch (_) {
      console.error(_);
      console.error(`file doesn't exists:`, file);
    }
  }

  async mergePdfs(filename: string) {
    const pdfFiles = await glob([`${this.tempDir}/**/*.pdf`]);
    const merger = new PDFMerger();
    for (const file of pdfFiles) {
      merger.add(file);
    }
    await ensureFile(filename);
    await merger.save(filename);
  }
}

export default FileConverter;
