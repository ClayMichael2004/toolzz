export const buildReadmePrompt = (report) => {
  const scriptsFormatted = Object.entries(report.scripts || {})
    .map(([name, cmd]) => `- \`${name}\`: \`${cmd}\``)
    .join("\n") || "No custom scripts declared.";

  const envVarsFormatted = (report.environment?.requiredVars || [])
    .map(v => `- \`${v}\``)
    .join("\n") || "No specific environment variables declared in .env.example.";

  const treeFormatted = (report.fileTreeSummary || [])
    .slice(0, 60)
    .join("\n") || "Standard repository layout.";

  const depsFormatted = (report.dependencies || [])
    .slice(0, 30)
    .join(", ") || "None declared.";

  return `
You are a Principal Software Architect and Lead Technical Writer.

Your task is to write a 100% accurate, precise, professional, and comprehensive README.md for the software repository analyzed below.
Base every command, setup instruction, script, environment variable, and feature description STRICTLY on the actual empirical project data provided. Do NOT hallucinate fake package names, fake CLI commands, or incorrect port numbers.

==================================================
EMPIRICAL REPOSITORY ANALYSIS REPORT
==================================================

1. PROJECT IDENTIFICATION
- Project Name: ${report.summary.projectName}
- Primary Language: ${report.summary.language}
- Package Manager: ${report.summary.packageManager}
- Description: ${report.summary.description || "N/A"}
- Overall Health Score: ${report.summary.overallScore}/100

2. DETECTED TECH STACK
- Frontend: ${report.techStack.frontend}
- Backend: ${report.techStack.backend}
- Database / ORM: ${report.techStack.database}
- Authentication: ${report.techStack.authentication}
- Build / Bundler: ${report.techStack.buildTool}
- Testing Framework: ${report.techStack.testing}

3. MANIFEST SCRIPTS & COMMANDS
${scriptsFormatted}

4. REQUIRED ENVIRONMENT VARIABLES
${envVarsFormatted}

5. KEY ENTRY POINTS & FILE METRICS
- Total Files: ${report.metrics.files}
- Total Folders: ${report.metrics.folders}
- Detected Entry Points: ${(report.entryPoints || []).join(", ") || "Standard main module"}

6. CORE DEPENDENCIES
${depsFormatted}

7. ARCHITECTURE & FOLDER LAYOUT
- Architecture Pattern: ${report.architecture?.architecture}
- Reasons: ${(report.architecture?.reasons || []).join(" ")}

Directory Structure (Subset):
\`\`\`
${treeFormatted}
\`\`\`

==================================================
INSTRUCTIONS FOR THE README GENERATOR
==================================================
Generate a complete, beautiful, production-ready README.md formatted in valid Markdown:

1. **Title & Badge Header**: Clear title, concise tagline, tech stack tags.
2. **Project Description**: A sharp, technical overview of what the project does.
3. **Key Features**: Highlight actual capabilities based on the tech stack and codebase architecture.
4. **Tech Stack Summary**: Clean table or list of technologies used.
5. **Environment Configuration**: List exact environment variables (${(report.environment?.requiredVars || []).join(", ") || "none"}) with instructions to copy \`.env.example\` to \`.env\`.
6. **Installation & Getting Started**: Step-by-step setup using the exact package manager (${report.summary.packageManager}) and scripts provided above (e.g. installation, starting dev server).
7. **Project Structure**: ASCII directory tree reflecting the actual repository structure.
8. **Available Scripts**: Document the actual npm/package scripts discovered.
9. **Testing & Quality Assurance**: Clear instructions for running tests based on the detected testing framework.
10. **License**: Standard section.

Return ONLY the pure Markdown content. Do NOT surround the response with markdown code blocks (e.g. \`\`\`markdown ... \`\`\`). Output pure markdown text directly.
`;
};
