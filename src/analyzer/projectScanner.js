import fs from "fs/promises";
import path from "path";
import ignoredDirectories from "./ignoreList.js";

const MANIFEST_FILENAMES = new Set([
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "yarn.lock",
  "requirements.txt",
  "pyproject.toml",
  "Pipfile",
  "setup.py",
  "environment.yml",
  "go.mod",
  "go.sum",
  "Cargo.toml",
  "Cargo.lock",
  "pom.xml",
  "build.gradle",
  "build.gradle.kts",
  "composer.json",
  "composer.lock",
  "Gemfile",
  "pubspec.yaml",
  "mix.exs",
  "Dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
  ".env.example",
  ".env",
  ".gitignore",
  "tsconfig.json",
  "vite.config.js",
  "vite.config.ts",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "webpack.config.js",
  "babel.config.js",
  ".eslintrc",
  ".eslintrc.json",
  ".eslintrc.js",
  "eslint.config.js",
  "tailwind.config.js",
  "tailwind.config.ts",
  "Makefile",
  "README.md",
  "README.txt",
  "README",
  "LICENSE",
  "LICENSE.md",
  "LICENSE.txt",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "SECURITY.md"
]);

const ENTRY_FILE_PATTERNS = [
  "server.js", "app.js", "index.js", "main.js",
  "server.ts", "app.ts", "index.ts", "main.ts",
  "main.py", "app.py", "wsgi.py", "asgi.py", "manage.py",
  "main.go", "main.rs", "Main.java", "index.php",
  "App.jsx", "App.tsx", "src/App.jsx", "src/App.tsx", "src/index.js", "src/index.ts", "src/server.js", "src/main.ts"
];

export const scanProject = async (projectPath) => {
  const result = {
    projectName: path.basename(projectPath),
    rootPath: projectPath,

    totalFiles: 0,
    totalFolders: 0,

    folders: [],
    fileTree: [], // List of relative file paths for structure tree

    manifestFiles: [], // List of detected config/manifest objects with content
    importantFiles: [], // Basic info objects for quick matching

    envVars: [], // Extracted env variable names
    entryFiles: [],
    testFiles: [],
    routeFiles: [],
    dbFiles: [],

    extensions: {}
  };

  async function walk(currentPath, depth = 0) {
    let entries;
    try {
      entries = await fs.readdir(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".") && entry.name !== ".env.example" && entry.name !== ".env" && entry.name !== ".gitignore" && entry.name !== ".github") {
        if (entry.isDirectory() && ignoredDirectories.includes(entry.name)) {
          continue;
        }
      }

      if (entry.isDirectory() && ignoredDirectories.includes(entry.name)) {
        continue;
      }

      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(projectPath, fullPath).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        result.totalFolders++;
        if (!result.folders.includes(entry.name)) {
          result.folders.push(entry.name);
        }
        if (depth < 4) {
          result.fileTree.push(`${relativePath}/`);
        }
        await walk(fullPath, depth + 1);
      } else {
        result.totalFiles++;
        const extension = path.extname(entry.name).toLowerCase() || entry.name;
        result.extensions[extension] = (result.extensions[extension] || 0) + 1;

        if (result.fileTree.length < 150) {
          result.fileTree.push(relativePath);
        }

        const lowerName = entry.name.toLowerCase();
        const lowerRel = relativePath.toLowerCase();

        // Important / Manifest file detection
        if (MANIFEST_FILENAMES.has(entry.name) || MANIFEST_FILENAMES.has(lowerName)) {
          result.importantFiles.push({ name: entry.name, path: fullPath, relativePath });

          // Read small text manifest files (up to 100KB)
          try {
            const stat = await fs.stat(fullPath);
            if (stat.size < 100 * 1024) {
              const content = await fs.readFile(fullPath, "utf-8");
              result.manifestFiles.push({
                name: entry.name,
                relativePath,
                content
              });

              // Extract environment variables if .env or .env.example
              if (entry.name === ".env.example" || entry.name === ".env") {
                const lines = content.split("\n");
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
                    const varName = trimmed.split("=")[0].trim();
                    if (varName && !result.envVars.includes(varName)) {
                      result.envVars.push(varName);
                    }
                  }
                }
              }
            }
          } catch (e) {
            // Ignore unreadable files
          }
        }

        // Test file detection
        if (
          lowerName.includes("test") ||
          lowerName.includes("spec") ||
          lowerRel.includes("/tests/") ||
          lowerRel.includes("/__tests__/")
        ) {
          result.testFiles.push(relativePath);
        }

        // Entry point detection
        if (ENTRY_FILE_PATTERNS.some(p => lowerRel.endsWith(p.toLowerCase()))) {
          result.entryFiles.push(relativePath);
        }

        // Routes / Controllers detection
        if (
          lowerRel.includes("route") ||
          lowerRel.includes("controller") ||
          lowerRel.includes("api/") ||
          lowerRel.includes("endpoints")
        ) {
          result.routeFiles.push(relativePath);
        }

        // DB / Schema detection
        if (
          lowerRel.includes("model") ||
          lowerRel.includes("schema") ||
          lowerRel.includes("prisma") ||
          lowerRel.includes("migration") ||
          lowerRel.includes("entity")
        ) {
          result.dbFiles.push(relativePath);
        }
      }
    }
  }

  await walk(projectPath);
  return result;
};