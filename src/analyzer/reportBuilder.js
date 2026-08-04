export const buildReport = ({
  scan,
  metadata,
  frameworks,
  dependencies,
  documentation,
  security,
  architecture,
  health
}) => {
  return {
    summary: {
      projectName: scan.projectName,
      language: metadata.language,
      overallScore: health.overallScore,
      packageManager: metadata.packageManager,
      description: metadata.description
    },

    techStack: {
      frontend: frameworks.frontend,
      backend: frameworks.backend,
      database: frameworks.database,
      authentication: frameworks.authentication,
      buildTool: frameworks.buildTool,
      testing: frameworks.testing
    },

    dependencies: metadata.dependencies || [],

    scripts: metadata.scripts || {},

    environment: {
      requiredVars: metadata.envVars || [],
      hasTemplate: documentation.envExample
    },

    entryPoints: metadata.entryFiles || [],

    architecture,

    documentation,

    security,

    metrics: {
      files: scan.totalFiles,
      folders: scan.totalFolders,
      testFiles: scan.testFiles?.length || 0,
      routeFiles: scan.routeFiles?.length || 0,
      extensions: scan.extensions
    },

    fileTreeSummary: (scan.fileTree || []).slice(0, 100),

    quality: {
      documentation: health.documentation,
      security: health.security,
      testing: health.testing,
      maintainability: health.maintainability
    },

    recommendations: health.recommendations
  };
};