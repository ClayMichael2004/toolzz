import { scanProject } from "./analyzer/projectScanner.js";

const result = await scanProject("src/temp/frontend");

console.log(result);