import { calculateHealthScore } from "./analyzer/healthScore.js";

const scanResult = {
    totalFiles: 120,
    totalFolders: 8,

    importantFiles: [
        {
            name: "package.json"
        },
        {
            name: "README.md"
        }
    ]
};

const metadata = {
    dependencies: [
        "react",
        "express",
        "helmet",
        "cors",
        "jsonwebtoken"
    ]
};

const frameworks = {
    testing: "Unknown",
    authentication: "JWT"
};

console.log(
    calculateHealthScore(
        scanResult,
        metadata,
        frameworks
    )
);