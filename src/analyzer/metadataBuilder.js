import fs from "fs/promises";

export const buildMetadata = async (scanResult) => {
    const metadata = {
        language: "Unknown",
        framework: "Unknown",
        backend: "Unknown",
        database: "Unknown",
        authentication: "Unknown",
        packageManager: "Unknown",
        dependencies: [],
    };

    // Detect language
    if (scanResult.extensions[".js"] || scanResult.extensions[".jsx"]) {
        metadata.language = "JavaScript";
    }

    if (scanResult.extensions[".ts"] || scanResult.extensions[".tsx"]) {
        metadata.language = "TypeScript";
    }

    // Find package.json
    const packageFile = scanResult.importantFiles.find(
        file => file.name === "package.json"
    );

    if (!packageFile) {
        return metadata;
    }

    const packageContent = JSON.parse(
        await fs.readFile(packageFile.path, "utf-8")
    );

    const dependencies = {
        ...packageContent.dependencies,
        ...packageContent.devDependencies
    };

    metadata.dependencies = Object.keys(dependencies || {});

    // Package manager
    if (packageContent.packageManager) {
        metadata.packageManager = packageContent.packageManager;
    } else {
        metadata.packageManager = "npm";
    }

    return metadata;
};