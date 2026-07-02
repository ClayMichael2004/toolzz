import { analyzeProject } from "./services/projectAnalysis.service.js";

const result = await analyzeProject(
    "src/temp/frontend"
);

console.dir(result, { depth: null });