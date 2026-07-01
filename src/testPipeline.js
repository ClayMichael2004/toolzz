import { analyzeProject } from "./services/projectAnalysis.service.js";

const result = await analyzeProject(
    "src/temp/c615d656-45f4-4f1f-a9fd-cb6b5ed3b261"
);

console.dir(result, { depth: null });