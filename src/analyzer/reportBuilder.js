export const buildReport = ({
    scan,
    metadata,
    frameworks,
    dependencies,
    documentation,
    architecture,
    health
}) => {

    return {

        summary: {
            projectName: scan.projectName,
            language: metadata.language,
            overallScore: health.overallScore
        },

        techStack: {
            frontend: frameworks.frontend,
            backend: frameworks.backend,
            database: frameworks.database,
            authentication: frameworks.authentication,
            buildTool: frameworks.buildTool,
            testing: frameworks.testing
        },

        dependenyAnalysis: dependencies,

        documentation,

        architecture,

        metrics: {
            files: scan.totalFiles,
            folders: scan.totalFolders,
            extensions: scan.extensions
        },

        quality: {
            documentation: health.documentation,
            security: health.security,
            testing: health.testing,
            maintainability: health.maintainability
        },

        recommendations: health.recommendations
    };

};