import { scanProject } from "../analyzer/projectScanner.js";
import { buildMetadata } from "../analyzer/metadataBuilder.js";
import { detectFrameworks } from "../analyzer/frameworkDetector.js";
import { calculateHealthScore } from "../analyzer/healthScore.js";

export const analyzeProject = async (projectPath) => {

    // Step 1: Scan the project
    const scanResult = await scanProject(projectPath);

    // Step 2: Build metadata
    const metadata = await buildMetadata(scanResult);

    // Step 3: Detect frameworks
    const frameworks = detectFrameworks(metadata.dependencies);

    // Step 4: Calculate health score
    const health = calculateHealthScore(
        scanResult,
        metadata,
        frameworks
    );

    return {
        scan: scanResult,
        metadata,
        frameworks,
        health
    };

};