export const scaffoldPrompt = (input) => {
  return `
You are an expert DevOps engineer and CLI tooling expert.

The user has provided a target project directory/file structure (which may be formatted as an ASCII tree, indented text, or list of file paths, and MAY CONTAIN INLINE COMMENTS like "# Ensures uploads..." or "// comment").

YOUR TASK:
1. Strip away any inline comments (# comment, // comment) attached to file or directory lines.
2. If the first line is a root folder (e.g. \`toolzz/\`), ensure all child directories and files are nested inside that root folder prefix (e.g. \`toolzz/src\`, \`toolzz/frontend\`, \`toolzz/.gitignore\`).
3. Generate ready-to-run scaffolding scripts in Bash, PowerShell, and Node.js.

==================================================
INPUT STRUCTURE
==================================================
${input}

==================================================
OUTPUT FORMAT INSTRUCTIONS
==================================================
Return a structured Markdown document with 3 main code tabs/sections:

### Bash Script (Linux / macOS / Git Bash)
\`\`\`bash
# Run this in your terminal to create the directory and file structure
mkdir -p ...
touch ...
\`\`\`

### PowerShell Script (Windows)
\`\`\`powershell
# Run this in PowerShell to create the directory and file structure
New-Item -ItemType Directory -Force -Path ...
New-Item -ItemType File -Force -Path ...
\`\`\`

### Node.js Script (Cross-Platform)
\`\`\`javascript
// Save as setup.js and run: node setup.js
const fs = require('fs');
const path = require('path');

const dirs = [ ... ];
const files = [ ... ];

dirs.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
files.forEach(file => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '');
});
console.log('Project structure created successfully!');
\`\`\`

CRITICAL: Strip out inline comments (# comment). Ensure top-level container folders (e.g. \`toolzz/\`) wrap all their child subdirectories and files so subfolders never become siblings of the root directory!
Do NOT output extra conversational chatter. Provide clean Markdown with the 3 code sections above.
`;
};
