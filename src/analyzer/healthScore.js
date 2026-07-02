export const calculateHealthScore = (
    scanResult,
    metadata,
    frameworks,
    documentation,
    security
) => {

    const report = {
        overallScore: 0,
        documentation: 0,
        security: 0,
        testing: 0,
        maintainability: 0,
        recommendations: []
    };

    // Documentation
    let documentationScore = 0;

    if (documentation.readme) documentationScore += 40;
    if (documentation.license) documentationScore += 20;
    if (documentation.envExample) documentationScore += 20;
    if (documentation.changelog) documentationScore += 10;
    if (documentation.contributing) documentationScore += 10;

    report.documentation = documentationScore;

    if (!documentation.readme) {
        report.recommendations.push(
            "Create a professional README.md."
        );
    }

    if (!documentation.license) {
        report.recommendations.push(
            "Add a LICENSE file."
        );
    }

    if (!documentation.envExample) {
        report.recommendations.push(
            "Provide a .env.example file."
        );
    }
    // Testing

    if (frameworks.testing !== "Unknown") {
        report.testing = 100;
    } else {
        report.testing = 20;
        report.recommendations.push(
            "Add automated tests (Vitest or Jest)."
        );
    }
    // Security
    let securityScore = 50;

    if (security.helmet) securityScore += 10;
    else {
        report.recommendations.push(
            "Use Helmet to secure Express applications."
        );
    }

    if (security.cors) securityScore += 10;

    if (security.jwt) securityScore += 10;
    else {
        report.recommendations.push(
            "Consider implementing authentication."
        );
    }

    if (security.bcrypt) securityScore += 10;

    if (security.dotenv) securityScore += 10;

    report.security = securityScore;

    // Maintainability
    let maintainability = 100;

    if (scanResult.totalFiles > 500) {
        maintainability -= 10;
    }

    if (scanResult.totalFolders < 3) {
        maintainability -= 20;

        report.recommendations.push(
            "Organize the project into logical folders."
        );
    }

    report.maintainability = maintainability;

    // Overall
    report.overallScore = Math.round(
        (
            report.documentation +
            report.security +
            report.testing +
            report.maintainability
        ) / 4
    );
    return report;

};
