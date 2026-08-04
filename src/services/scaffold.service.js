export const parseTreeToPaths = (inputText) => {
  const lines = inputText.split("\n");
  const dirs = new Set();
  const files = new Set();

  let rootFolder = "";
  const cleanedItems = [];

  // Step 1: Detect root container folder and clean comments
  for (let rawLine of lines) {
    if (!rawLine.trim()) continue;

    // Strip comments (# ..., // ..., /* ...)
    let line = rawLine;
    const commentIndex = Math.min(
      line.indexOf("#") === -1 ? Infinity : line.indexOf("#"),
      line.indexOf("//") === -1 ? Infinity : line.indexOf("//"),
      line.indexOf("/*") === -1 ? Infinity : line.indexOf("/*")
    );
    if (commentIndex !== Infinity) {
      line = line.slice(0, commentIndex);
    }
    if (!line.trim()) continue;

    const hasBranchSymbol = /[├└+\\|\-─]/.test(line);

    // If first non-empty line has no branch symbols, it's the root container folder!
    if (cleanedItems.length === 0 && !hasBranchSymbol) {
      const candidateRoot = line.trim().replace(/[\/:\\]+$/, "");
      if (candidateRoot && !candidateRoot.includes(".")) {
        rootFolder = candidateRoot;
        continue;
      }
    }

    cleanedItems.push({ rawLine, line });
  }

  const pathStack = rootFolder ? [rootFolder] : [];

  for (let item of cleanedItems) {
    const line = item.line;

    // Determine tree depth level by counting pipe symbols ('│' or '|') or indent blocks before branch symbol
    let indentPart = "";
    const branchMatch = line.match(/^(.*?)[├└+]/);
    if (branchMatch) {
      indentPart = branchMatch[1];
    } else {
      indentPart = (line.match(/^[\s│|]*/) || [""])[0];
    }

    const treePipes = (indentPart.match(/[│|]/g) || []).length;
    const plainSpaces = indentPart.replace(/[│|]/g, "").length;
    const spaceLevels = Math.floor(plainSpaces / 4);

    const relativeDepth = (branchMatch ? treePipes + spaceLevels : 0) + (rootFolder ? 1 : 0);

    // Clean entry name
    let cleanName = line
      .replace(/^[│|\s├└+\]\\|\-─]+/, "")
      .trim()
      .replace(/[\/:\\]+$/, "");

    if (!cleanName) continue;

    // Determine if entry is directory or file
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(cleanName) || cleanName.startsWith(".");
    const isKnownConfig = ["dockerfile", "makefile", "license", "procfile", "readme"].includes(cleanName.toLowerCase());
    const isExplicitDir = line.trim().endsWith("/");
    const isDir = isExplicitDir || (!hasExtension && !isKnownConfig);

    // Adjust stack to relativeDepth
    while (pathStack.length > relativeDepth) {
      pathStack.pop();
    }
    pathStack[relativeDepth] = cleanName;

    const fullPath = pathStack.slice(0, relativeDepth + 1).join("/");

    if (isDir) {
      dirs.add(fullPath);
    } else {
      if (relativeDepth > 0) {
        dirs.add(pathStack.slice(0, relativeDepth).join("/"));
      }
      files.add(fullPath);
    }
  }

  if (rootFolder) {
    dirs.add(rootFolder);
  }

  return {
    dirs: Array.from(dirs).sort(),
    files: Array.from(files).sort()
  };
};

export const generateFallbackScaffoldScript = (inputText) => {
  const { dirs, files } = parseTreeToPaths(inputText);

  if (dirs.length === 0 && files.length === 0) {
    return "Could not parse structure. Please enter a valid directory tree or path list.";
  }

  const bashDirs = dirs.map(d => `mkdir -p "${d}"`).join("\n");
  const bashFiles = files.map(f => `touch "${f}"`).join("\n");

  const psDirs = dirs.map(d => `New-Item -ItemType Directory -Force -Path "${d}"`).join("\n");
  const psFiles = files.map(f => `New-Item -ItemType File -Force -Path "${f}"`).join("\n");

  const nodeDirs = JSON.stringify(dirs, null, 2);
  const nodeFiles = JSON.stringify(files, null, 2);

  return `
### Bash Script (Linux / macOS / Git Bash)
\`\`\`bash
# Create directory structure
${bashDirs}

# Create empty files
${bashFiles}

echo "Directory structure created successfully!"
\`\`\`

### PowerShell Script (Windows)
\`\`\`powershell
# Create directory structure
${psDirs}

# Create empty files
${psFiles}

Write-Host "Directory structure created successfully!"
\`\`\`

### Node.js Script (Cross-Platform)
\`\`\`javascript
// Save as setup.js and execute: node setup.js
const fs = require('fs');
const path = require('path');

const dirs = ${nodeDirs};

const files = ${nodeFiles};

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
files.forEach(file => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '');
  }
});

console.log('Directory structure created successfully!');
\`\`\`
`;
};
