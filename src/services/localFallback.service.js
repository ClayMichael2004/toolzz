import { generateFallbackScaffoldScript } from "./scaffold.service.js";

export const generateFallbackCommitMessage = (input) => {
  const text = (input || "").trim();
  const lower = text.toLowerCase();

  let type = "feat";
  let scope = "core";

  if (lower.includes("fix") || lower.includes("bug") || lower.includes("error") || lower.includes("resolve")) {
    type = "fix";
  } else if (lower.includes("doc") || lower.includes("readme")) {
    type = "docs";
  } else if (lower.includes("style") || lower.includes("css") || lower.includes("ui")) {
    type = "style";
  } else if (lower.includes("refactor") || lower.includes("clean") || lower.includes("restructure")) {
    type = "refactor";
  } else if (lower.includes("test")) {
    type = "test";
  }

  if (lower.includes("auth") || lower.includes("login") || lower.includes("token") || lower.includes("jwt")) {
    scope = "auth";
  } else if (lower.includes("ui") || lower.includes("page") || lower.includes("component") || lower.includes("sidebar")) {
    scope = "ui";
  } else if (lower.includes("api") || lower.includes("route") || lower.includes("controller") || lower.includes("backend")) {
    scope = "api";
  } else if (lower.includes("db") || lower.includes("database") || lower.includes("mongo") || lower.includes("sql")) {
    scope = "db";
  }

  const cleanSubject = text.replace(/^(fix|added|updated|created|removed|refactored)\s+/i, "");

  return `${type}(${scope}): ${cleanSubject.slice(0, 72)}

- Summary: ${text}
- Conventional commit generated automatically
`;
};

export const generateFallbackErrorDiagnosis = (input) => {
  const errorText = (input || "").trim();
  const firstLine = errorText.split("\n")[0] || "Unknown Error";

  let errorType = "Runtime Exception";
  if (errorText.includes("TypeError")) errorType = "TypeError (Property Access on Null/Undefined)";
  else if (errorText.includes("ECONNREFUSED")) errorType = "Connection Refused (Network / Port Error)";
  else if (errorText.includes("CORS")) errorType = "CORS Policy Restriction";
  else if (errorText.includes("SyntaxError")) errorType = "Syntax Error";
  else if (errorText.includes("404")) errorType = "HTTP 404 Not Found";
  else if (errorText.includes("500")) errorType = "HTTP 500 Internal Server Error";

  return `### Error Diagnosis & Resolution Report

#### 1. Simple Explanation
The application encountered a **${errorType}**. This usually happens when an operation fails to complete or dereferences an uninitialized value.

#### 2. Technical Cause
\`\`\`text
${firstLine}
\`\`\`
The runtime engine threw an unhandled exception while attempting to execute the instruction above.

#### 3. Common Reasons
- Attempting to read properties of \`null\` or \`undefined\`.
- Target API or database server is offline or unreachable on the specified port.
- Missing headers, missing environment variables, or CORS origin restrictions.

#### 4. Fix & Resolution Code Example
Check that your target variables are initialized before access:

\`\`\`javascript
// Recommended Defensive Fix:
if (data && data.property) {
    // Process safely
    console.log(data.property);
} else {
    console.warn("Property is not available yet");
}
\`\`\`

#### 5. Best Practices
- Always validate object payloads using optional chaining (\`?.\`) or fallback defaults.
- Verify environment variables and API URLs are configured in production.
- Use try/catch blocks around asynchronous network requests.
`;
};

export const generateFallbackReadme = (input) => {
  return `# Project Documentation

## Overview
This repository contains application source code and workspace configuration files.

## Features
- **Modular Architecture**: Designed with modern JavaScript / Node.js best practices.
- **RESTful Endpoints**: Built with Express framework for high throughput.
- **Developer Tooling**: Includes automated configuration scripts and deployment setups.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
\`\`\`bash
npm install
\`\`\`

### Running the Application
\`\`\`bash
npm start
\`\`\`

## License
ISC License
`;
};

export const generateSmartFallback = (tool, input) => {
  if (tool === "commit") {
    return generateFallbackCommitMessage(input);
  }
  if (tool === "error") {
    return generateFallbackErrorDiagnosis(input);
  }
  if (tool === "scaffold" || tool === "structure") {
    return generateFallbackScaffoldScript(input);
  }
  if (tool === "readme") {
    return generateFallbackReadme(input);
  }
  return `### Generated Analysis Output for ${tool}\n\n${input}`;
};
