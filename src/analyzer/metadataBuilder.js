export const buildMetadata = async (scanResult) => {
  const metadata = {
    language: "Unknown",
    framework: "Unknown",
    backend: "Unknown",
    database: "Unknown",
    authentication: "Unknown",
    packageManager: "Unknown",
    dependencies: [],
    devDependencies: [],
    scripts: {},
    envVars: scanResult.envVars || [],
    entryFiles: scanResult.entryFiles || [],
    testFiles: scanResult.testFiles || [],
    routeFiles: scanResult.routeFiles || [],
    dbFiles: scanResult.dbFiles || [],
    description: ""
  };

  // 1. Language Detection via Extensions
  const ext = scanResult.extensions || {};
  const extCounts = {
    JavaScript: (ext[".js"] || 0) + (ext[".jsx"] || 0) + (ext[".mjs"] || 0) + (ext[".cjs"] || 0),
    TypeScript: (ext[".ts"] || 0) + (ext[".tsx"] || 0),
    Python: (ext[".py"] || 0),
    Go: (ext[".go"] || 0),
    Rust: (ext[".rs"] || 0),
    Java: (ext[".java"] || 0),
    Kotlin: (ext[".kt"] || 0) + (ext[".kts"] || 0),
    PHP: (ext[".php"] || 0),
    Ruby: (ext[".rb"] || 0),
    "C#": (ext[".cs"] || 0),
    C: (ext[".c"] || 0) + (ext[".h"] || 0),
    "C++": (ext[".cpp"] || 0) + (ext[".hpp"] || 0) + (ext[".cc"] || 0),
    Elixir: (ext[".ex"] || 0) + (ext[".exs"] || 0),
    Dart: (ext[".dart"] || 0)
  };

  let maxCount = 0;
  let topLang = "Unknown";
  for (const [lang, count] of Object.entries(extCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topLang = lang;
    }
  }
  metadata.language = topLang;

  // 2. Parse Node.js package.json
  const packageManifest = scanResult.manifestFiles.find(
    m => m.name === "package.json"
  );

  if (packageManifest) {
    try {
      const pkg = JSON.parse(packageManifest.content);
      metadata.description = pkg.description || "";
      metadata.packageManager = pkg.packageManager || (scanResult.manifestFiles.some(m => m.name === "pnpm-lock.yaml") ? "pnpm" : scanResult.manifestFiles.some(m => m.name === "yarn.lock") ? "yarn" : "npm");

      const deps = Object.keys(pkg.dependencies || {});
      const devDeps = Object.keys(pkg.devDependencies || {});
      metadata.dependencies = Array.from(new Set([...deps, ...devDeps]));
      metadata.devDependencies = devDeps;
      metadata.scripts = pkg.scripts || {};
    } catch {
      // JSON parse error handled gracefully
    }
  }

  // 3. Parse Python manifests (requirements.txt / pyproject.toml)
  const reqManifest = scanResult.manifestFiles.find(m => m.name === "requirements.txt");
  if (reqManifest) {
    const lines = reqManifest.content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const pkgName = trimmed.split(/[==,>=,<=,~=,!=,<,>]/)[0].trim();
        if (pkgName && !metadata.dependencies.includes(pkgName.toLowerCase())) {
          metadata.dependencies.push(pkgName.toLowerCase());
        }
      }
    }
    if (metadata.language === "Unknown") metadata.language = "Python";
  }

  const pyprojectManifest = scanResult.manifestFiles.find(m => m.name === "pyproject.toml");
  if (pyprojectManifest) {
    if (metadata.language === "Unknown") metadata.language = "Python";
  }

  // 4. Parse Go go.mod
  const goManifest = scanResult.manifestFiles.find(m => m.name === "go.mod");
  if (goManifest) {
    const lines = goManifest.content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("require ") || trimmed.startsWith("\t")) {
        const parts = trimmed.replace("require", "").trim().split(/\s+/);
        if (parts[0]) {
          metadata.dependencies.push(parts[0]);
        }
      }
    }
    if (metadata.language === "Unknown" || metadata.language === "JavaScript") metadata.language = "Go";
  }

  // 5. Parse Rust Cargo.toml
  const cargoManifest = scanResult.manifestFiles.find(m => m.name === "Cargo.toml");
  if (cargoManifest) {
    if (metadata.language === "Unknown") metadata.language = "Rust";
  }

  // 6. Parse PHP composer.json
  const composerManifest = scanResult.manifestFiles.find(m => m.name === "composer.json");
  if (composerManifest) {
    try {
      const comp = JSON.parse(composerManifest.content);
      const reqs = Object.keys(comp.require || {});
      metadata.dependencies = Array.from(new Set([...metadata.dependencies, ...reqs]));
    } catch {}
    if (metadata.language === "Unknown") metadata.language = "PHP";
  }

  return metadata;
};