export const detectDocumentation = (scanResult) => {
  const fileNames = (scanResult.importantFiles || []).map(file => file.name.toLowerCase());
  const relPaths = (scanResult.fileTree || []).map(p => p.toLowerCase());

  const has = (name) => fileNames.some(f => f === name.toLowerCase()) || relPaths.some(p => p.endsWith(name.toLowerCase()));

  const report = {
    readme: has("README.md") || has("README.txt") || has("README"),
    license: has("LICENSE") || has("LICENSE.md") || has("LICENSE.txt"),
    envExample: has(".env.example") || has(".env.template") || has(".env.sample"),
    changelog: has("CHANGELOG.md") || has("CHANGELOG.txt"),
    contributing: has("CONTRIBUTING.md"),
    securityPolicy: has("SECURITY.md"),
    dockerfile: has("Dockerfile"),
    dockerCompose: has("docker-compose.yml") || has("docker-compose.yaml"),
    ciWorkflows: relPaths.some(p => p.includes(".github/workflows"))
  };

  const trueCount = Object.values(report).filter(val => val === true).length;
  report.score = Math.min(100, Math.round((trueCount / Object.keys(report).length) * 100));

  return report;
};