export const scaffoldPrompt = (input) => {
  return `
You are an expert DevOps engineer and CLI tooling expert.

The user has provided a target project directory/file structure (which may be formatted as an ASCII tree, indented text, or list of file paths).

YOUR TASK:
Analyze the input structure and generate ready-to-run scaffolding scripts in Bash, PowerShell, and Node.js.

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

Ensure all directory paths and file paths are correctly parsed from the input, correctly nested, and free of typos.
Do NOT output extra conversational chatter. Provide clean Markdown with the 3 code sections above.
`;
};
