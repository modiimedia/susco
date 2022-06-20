# SUSCO - Generate a PDF from Source Code

A NodeJS tool made to please the morons at the US Copyright Office. It that will take every text file in a directory and output them into a single PDF. Images and other binary file extensions will be ignored.

See `/example` to see an example PDF generated from this repo using an example script.

## Why SUSCO?

If you've ever tried to submit source code to the US Copyright Office you may have recieved a response like this:

> "It looks like you uploaded a runnable copy of your program. We need the textual source code to register the computer program."

Even though what you submitted IS IN FACT the textual source code. When pressing further you will discover that they want you to submit a PDF or printed version of the source code which is frankly ridiculous.

From the copyright.gov website ([https://www.copyright.gov/circs/circ61.pdf](https://www.copyright.gov/circs/circ61.pdf))

> You can upload the source code to the electronic registration system, preferably as a PDF file or other file type accepted by the Copyright Office. The list of acceptable file types is available online. Alternatively, you can print out the source code on paper and mail it to the Office. In all cases, add the title and version number of the program to the first page of the code.

For this reason, SUSCO (aka "Stupid United States Copyright Office") was created to automate this process.

## Installation

This package requires that you have [wkhtmltopdf](https://wkhtmltopdf.org/) installed on your machine. Ensure that you have it properly installed and then run the following commands.

```
npm install susco
```

## Usage

```ts
// both require.js and es6 imports are supported
import { generatePdf } from "susco";
const { generatePdf } = require("susco");

const config = defineConfig();

generatePdf({
  heading: "Some title",
  description: "Some description",
  // accepts an array of glob patterns
  include: ["src/**/*", "scripts/**/*"],
  // accepts an array of glob patterns
  ignore: ["node_modules", "dist", "some-other-lib/**/*.ts"],
  output: "<output-file>",
  disableLogs: false, // false by default
});
```
