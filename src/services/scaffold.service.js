export const parseTreeToPaths = (inputText) => {
  const lines = inputText.split("\n");
  const dirs = new Set();
  const files = new Set();

  const pathStack = [];

  for (let rawLine of lines) {
    let line = rawLine;

    // Skip empty lines
    if (!line.trim()) continue;

    // Determine leading indentation depth before tree symbols
    const indentMatch = line.match(/^[\s│|]*/);
    const leadingSpaces = indentMatch ? indentMatch[0].replace(/│/g, " ").replace(/\|/g, " ").length : 0;
    const depth = Math.floor(leadingSpaces / 2);

    // Clean tree branch symbols (├─, └─, ├──, └──, +--, etc.)
    line = line
      .replace(/^[\s│|]+/, "")
      .replace(/^[├└+\]\\|\-─\s]+/, "")
      .trim();

    if (!line) continue;

    // Strip inline comments (# ..., // ..., /* ...)
    const commentIndex = Math.min(
      line.indexOf("#") === -1 ? Infinity : line.indexOf("#"),
      line.indexOf("//") === -1 ? Infinity : line.indexOf("//"),
      line.indexOf("/*") === -1 ? Infinity : line.indexOf("/*")
    );

    const hasExplicitDirSlash = (commentIndex !== Infinity ? line.slice(0, commentIndex) : line).trim().endsWith("/");

    if (commentIndex !== Infinity) {
      line = line.slice(0, commentIndex).trim();
    }

    if (!line) continue;

    const cleanName = line.replace(/\/$/, "").trim();
    if (!cleanName) continue;

    // Determine if entry is directory or file
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(cleanName) || cleanName.startsWith(".");
    const isKnownConfig = ["dockerfile", "makefile", "license", "procfile", "readme"].includes(cleanName.toLowerCase());
    const isDir = hasExplicitDirSlash || (!hasExtension && !isKnownConfig);

    // Adjust path stack according to depth
    while (pathStack.length > depth) {
      pathStack.pop();
    }
    pathStack[depth] = cleanName;

    const fullPath = pathStack.slice(0, depth + 1).join("/");

    if (isDir) {
      dirs.add(fullPath);
    } else {
      // Ensure parent directory is tracked
      if (depth > 0) {
        dirs.add(pathStack.slice(0, depth).join("/"));
      }
      files.add(fullPath);
    }
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
