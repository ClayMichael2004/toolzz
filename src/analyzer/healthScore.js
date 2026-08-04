export const calculateHealthScore = (
  scanResult,
  metadata,
  frameworks,
  dependencies,
  documentation,
  security
) => {
  const recommendations = [];

  // 1. Documentation Score
  const docScore = documentation.score || 0;
  if (!documentation.readme) {
    recommendations.push("Create a comprehensive README.md file explaining project usage, setup, and endpoints.");
  }
  if (!documentation.envExample && metadata.envVars?.length > 0) {
    recommendations.push("Provide a `.env.example` template for required environment variables.");
  }
  if (!documentation.license) {
    recommendations.push("Add an open-source or proprietary LICENSE file.");
  }
  if (!documentation.dockerfile) {
    recommendations.push("Consider adding a Dockerfile for containerized deployment parity.");
  }

  // 2. Security Score
  const secScore = security.score || 0;
  if (!security.helmet && frameworks.backend === "Express.js") {
    recommendations.push("Install `helmet` middleware to set HTTP security headers.");
  }
  if (!security.cors && (frameworks.backend !== "Not detected")) {
    recommendations.push("Configure explicit CORS policy middleware to restrict unauthorized origins.");
  }
  if (!security.rateLimit && frameworks.backend !== "Not detected") {
    recommendations.push("Implement API rate-limiting middleware (e.g. `express-rate-limit`) to prevent abuse.");
  }
  if (!security.validation) {
    recommendations.push("Add robust input schema validation (e.g. Zod, Joi, Pydantic) for API request payloads.");
  }
  if (!security.gitignore) {
    recommendations.push("Add a `.gitignore` file to prevent committing secrets and build artifacts.");
  }

  // 3. Testing Score
  let testingScore = 0;
  const testFileCount = (scanResult.testFiles || []).length;
  const hasTestFramework = frameworks.testing !== "Not detected";

  if (hasTestFramework && testFileCount > 0) {
    testingScore = 100;
  } else if (hasTestFramework) {
    testingScore = 65;
    recommendations.push(`Test framework (${frameworks.testing}) configured, but no test files were detected.`);
  } else if (testFileCount > 0) {
    testingScore = 60;
  } else {
    testingScore = 20;
    recommendations.push("Set up unit and integration tests (e.g. Vitest, Jest, Pytest) to verify code reliability.");
  }

  // 4. Maintainability Score
  let maintainabilityScore = 50;
  if (metadata.language === "TypeScript") maintainabilityScore += 20;
  if (scanResult.manifestFiles.some(m => m.name.includes("eslint") || m.name.includes("prettier"))) maintainabilityScore += 15;
  if (documentation.ciWorkflows) maintainabilityScore += 15;

  maintainabilityScore = Math.min(100, maintainabilityScore);

  // Overall Weighted Score
  const overallScore = Math.round(
    docScore * 0.25 +
    secScore * 0.30 +
    testingScore * 0.25 +
    maintainabilityScore * 0.20
  );

  return {
    overallScore,
    documentation: docScore,
    security: secScore,
    testing: testingScore,
    maintainability: maintainabilityScore,
    recommendations
  };
};
