import { scanProject } from "./analyzer/projectScanner.js";

const result = await scanProject("src/temp/c615d656-45f4-4f1f-a9fd-cb6b5ed3b261");

console.log(result);