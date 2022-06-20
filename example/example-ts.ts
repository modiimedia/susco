// run "npm install"
// run "npx ts-node example/example-ts"

import { generatePdf } from "../src/main";

generatePdf({
  heading: "SUSCO (Source Code)",
  description:
    "A library created by Joshua Sosso to auto generate a pdf from source code.",
  include: ["package.json", "README.md", "src/**/*", "script/**/*"],
  ignore: [],
  output: "example/example.pdf",
});
