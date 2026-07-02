export const buildReadmePrompt = (report) => {

    return `
You are a senior software engineer and technical writer.

Generate a professional README.md for the following software project.

Project Summary
---------------
Project Name: ${report.summary.projectName}
Language: ${report.summary.language}
Health Score: ${report.summary.overallScore}/100

Tech Stack
----------
Frontend: ${report.techStack.frontend}
Backend: ${report.techStack.backend}
Database: ${report.techStack.database}
Authentication: ${report.techStack.authentication}
Build Tool: ${report.techStack.buildTool}
Testing: ${report.techStack.testing}

Architecture
------------
${report.architecture.architecture}

Project Metrics
---------------
Files: ${report.metrics.files}
Folders: ${report.metrics.folders}

Recommendations
---------------
${report.recommendations.join("\n")}

Write a README containing:

# Project Title

## Description

## Features

## Tech Stack

## Installation

## Usage

## Project Structure

## API (if applicable)

## Future Improvements

## License

Return ONLY valid Markdown.
`;

};
