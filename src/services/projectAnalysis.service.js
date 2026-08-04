import { scanProject } from "../analyzer/projectScanner.js";
import { buildMetadata } from "../analyzer/metadataBuilder.js";
import { detectFrameworks } from "../analyzer/frameworkDetector.js";
import { calculateHealthScore } from "../analyzer/healthScore.js";
import { detectArchitecture } from "../analyzer/architectureDetector.js";
import { buildReport } from "../analyzer/reportBuilder.js";
import { detectDependencies } from "../analyzer/dependencyDetector.js";
import { detectDocumentation } from "../analyzer/documentationDetector.js";
import { detectSecurity } from "../analyzer/securityDetector.js";

export const analyzeProject = async (projectPath) => {
  // Step 1: Deep scan repository files, manifests, and tree
  const scanResult = await scanProject(projectPath);

  // Step 2: Build polyglot metadata and parse dependency manifests
  const metadata = await buildMetadata(scanResult);

  // Step 3: Detect frameworks, ORMs, build tools, and testing stacks
  const frameworks = detectFrameworks(metadata.dependencies, scanResult);

  // Step 4: Categorize dependencies
  const dependencies = detectDependencies(metadata.dependencies);

  // Step 5: Audit documentation completeness
  const documentation = detectDocumentation(scanResult);

  // Step 6: Perform security check
  const security = detectSecurity(metadata.dependencies, scanResult.importantFiles);

  // Step 7: Calculate health score and recommendations
  const health = calculateHealthScore(
    scanResult,
    metadata,
    frameworks,
    dependencies,
    documentation,
    security
  );

  // Step 8: Detect architectural pattern
  const architecture = detectArchitecture(scanResult);

  // Step 9: Build complete, deep report
  const report = buildReport({
    scan: scanResult,
    metadata,
    frameworks,
    dependencies,
    documentation,
    security,
    architecture,
    health,
  });

  return report;
};