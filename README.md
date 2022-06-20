# SUSCO (Stupid United States Copyright Office)

The united states copyright office is stupid. They want to recieve source code as PDF files. This is a library will convert all text files in a directory to a single PDF.

## Installation

```
npm install susco
```

## Usage

```ts
// both require.js and es6 imports are supported
import { defineConfig, generatePdf } from "susco";
const { defineConfig, generatePdf } = require("susco");

const config = defineConfig({
  dir: "<root-directory>",
  output: "<file-to-output-to>",
  ignore: ["node_modules", "dist", "compiled-libs"],
  disableLogs: false,
});

generatePdf(config);
```
