import { detectFrameworks } from "./analyzer/frameworkDetector.js";

const dependencies = [
    "react",
    "vite",
    "express",
    "jsonwebtoken",
    "pg",
    "multer"
];

console.log(detectFrameworks(dependencies));