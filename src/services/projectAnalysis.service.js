import { scanProject } from "../analyzer/projectScanner.js";
import { buildMetadata } from "../analyzer/metadataBuilder.js";
import { detectFrameworks } from "../analyzer/frameworkDetector.js";
import { calculateHealthScore } from "../analyzer/healthScore.js";
import { detectArchitecture } from "../analyzer/architectureDetector.js";
import { buildReport } from "../analyzer/reportBuilder.js";
import  {detectDependencies}from "../analyzer/dependencyDetector.js"
import { detectDocumentation } from "../analyzer/documentationDetector.js";

export const analyzeProject = async (projectPath) => {

    // Step 1: Scan the project
    const scanResult = await scanProject(projectPath);

    // Step 2: Build metadata
    const metadata = await buildMetadata(scanResult);

    // Step 3: Detect frameworks
    const frameworks = detectFrameworks(metadata.dependencies);

    // Step 4: dependencies metadata
    const dependencies=detectDependencies(metadata.dependencies);

    //Step 5: documentation scanner
    const documentation=detectDocumentation(scanResult);

    // Step 4: Calculate health score
    const health = calculateHealthScore(
        scanResult,
        metadata,
        frameworks
    );

    // Step 5: Determine architecture (placeholder for now)
    const architecture = detectArchitecture(scanResult);

    // Step 6: Build report
    const report = buildReport({
        scan: scanResult,
        metadata,
        frameworks,
        dependencies,
        documentation,
        architecture,
        health,
    });

    return report;
};