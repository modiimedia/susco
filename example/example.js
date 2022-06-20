// run "npm install"
// run "npm run build"
// run "node example/example"
const { generatePdf } = require("../dist/main");

generatePdf({
  heading: "SUSCO (Source Code)",
  description:
    "A library created by Joshua Sosso to auto generate a pdf from source code.",
  include: [
    "package.json",
    "README.md",
    "src/**/*",
    "script/**/*",
    "test_files/**/*",
  ],
  ignore: ["**/*.copy"],
  output: "example/example.pdf",
});
