import fs from "fs/promises";
import path from "path";
import ignoredDirectories from "./ignoreList.js";

export const scanProject = async (projectPath) => {

    const result = {
        projectName: path.basename(projectPath),
        rootPath: projectPath,

        totalFiles: 0,
        totalFolders: 0,

        folders: [],

        importantFiles: [],

        extensions: {}
    };

    async function walk(currentPath) {

        const entries = await fs.readdir(currentPath, {
            withFileTypes: true
        });

        for (const entry of entries) {

            if (
                entry.isDirectory() &&
                ignoredDirectories.includes(entry.name)
            ) {
                continue;
            }

            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {

                result.totalFolders++;

                result.folders.push(entry.name);

                await walk(fullPath);

            } else {

                result.totalFiles++;

                const extension = path.extname(entry.name);

                result.extensions[extension] =
                    (result.extensions[extension] || 0) + 1;

                if (
                    [
                        "package.json",
                        "README.md",
                        "Dockerfile",
                        "docker-compose.yml",
                        ".env.example",
                        "go.mod",
                        "requirements.txt",
                        "Cargo.toml"
                    ].includes(entry.name)
                ) {

                    result.importantFiles.push({ name: entry.name, path: fullPath });

                }

            }

        }

    }

    await walk(projectPath);

    return result;

};