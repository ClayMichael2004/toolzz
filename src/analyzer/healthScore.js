export const calculateHealthScore = (
    scanResult,
    metadata,
    frameworks
) => {

    const report = {
        overallScore: 0,

        documentation: 0,
        security: 0,
        testing: 0,
        maintainability: 0,

        recommendations: []
    };

    //-------------------------------------------------
    // Documentation
    //-------------------------------------------------

    const hasReadme = scanResult.importantFiles.some(
        file => file.name === "README.md"
    );

    report.documentation = hasReadme ? 100 : 30;

    if (!hasReadme) {
        report.recommendations.push(
            "Create a professional README.md."
        );
    }

    //-------------------------------------------------
    // Testing
    //-------------------------------------------------

    if (frameworks.testing !== "Unknown") {
        report.testing = 100;
    } else {
        report.testing = 20;

        report.recommendations.push(
            "Add automated tests (Vitest or Jest)."
        );
    }

    //-------------------------------------------------
    // Security
    //-------------------------------------------------

    report.security = 70;

    if (
        metadata.dependencies.includes("helmet")
    ) {
        report.security += 15;
    } else {

        report.recommendations.push(
            "Use Helmet to secure Express applications."
        );

    }

    if (
        metadata.dependencies.includes("cors")
    ) {

        report.security += 15;

    }

    if (
        !metadata.dependencies.includes("jsonwebtoken") &&
        frameworks.authentication === "Unknown"
    ) {

        report.recommendations.push(
            "Consider implementing authentication."
        );

    }

    //-------------------------------------------------
    // Maintainability
    //-------------------------------------------------

    report.maintainability = 100;

    if (scanResult.totalFiles > 500) {

        report.maintainability -= 10;

    }

    if (scanResult.totalFolders < 3) {

        report.maintainability -= 20;

        report.recommendations.push(
            "Organize the project into logical folders."
        );

    }

    //-------------------------------------------------
    // Overall Score
    //-------------------------------------------------

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