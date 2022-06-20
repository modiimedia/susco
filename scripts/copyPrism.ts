import { copy } from "fs-extra";

const main = async () => {
  await copy(
    "node_modules/prismjs/themes/prism.min.css",
    "src/assets/prism.css.copy"
  );
  await copy("node_modules/prismjs/prism.js", "src/assets/prism.js.copy");
};

main();
