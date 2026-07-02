export const detectDocumentation = (scanResult) => {

    const fileNames = scanResult.importantFiles.map(file => file.name);

    const has = (name) => fileNames.includes(name);

    const report = {

        readme: has("README.md"),

        license: has("LICENSE"),

        envExample: has(".env.example"),

        changelog: has("CHANGELOG.md"),

        contributing: has("CONTRIBUTING.md"),

        dockerfile: has("Dockerfile"),

        dockerCompose: has("docker-compose.yml")

    };

    report.score = Object.values(report)
        .filter(value => value === true)
        .length;

    return report;

};