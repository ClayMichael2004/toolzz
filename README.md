# Toolzz AI — Minimalist Developer Suite

Toolzz AI is a high-performance developer workspace designed to streamline workflow tasks including Git commit message generation, stack trace error diagnosis, automated README generation, and repository health analysis. Built with a matte obsidian black design system, zero clutter, and clear non-overlapping outputs.

---

## Key Features

- **Folder Structure Scaffolder**: Paste any ASCII directory tree or text folder hierarchy to generate executable **Bash**, **PowerShell**, and **Node.js** setup scripts that automatically build the folders and files.
- **Git Commit Message Generator**: Convert messy diff notes or task descriptions into conventional, structured git commit messages.
- **Error Explainer & Fixer**: Paste stack traces or compiler error output to get root-cause diagnosis and actionable code resolutions.
- **Project Analyzer**: Perform automated health audits on repository ZIP archives to inspect code metrics, testing coverage, security controls, and quality scores.
- **README Generator**: Upload a repository ZIP archive to generate a structured `README.md` complete with tech stack badges, features, and setup commands.
- **Minimalist Black UI/UX**: Designed with a matte black aesthetic (`#09090b`), high-contrast typography (`Inter` & `JetBrains Mono`), responsive navigation, and tabbed output viewing (Formatted Markdown vs Raw Text).
- **Privacy & Upload Hygiene**: All ZIP uploads and extracted temp files are automatically deleted after processing and excluded from Git tracking.

---

## Tech Stack

- **Frontend**: React 19, React Router v7, React Markdown, Lucide Icons, Vite
- **Backend**: Node.js, Express, Multer, Extract-Zip
- **AI Integration**: Google Gemini API / OpenAI API

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ClayMichael2004/toolzz.git
   cd toolzz
   ```

2. **Install Backend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ```

---

## Running the Application

### Start Backend Server
```bash
npm start
```
The server will run at `http://localhost:5000`.

### Start Frontend Client
In a separate terminal window:
```bash
cd frontend
npm run dev
```
The frontend app will run at `http://localhost:5173`.

---

## Repository Structure

```
toolzz/
├── src/
│   ├── analyzer/           # Zip extraction & repository analysis logic
│   ├── controllers/        # Express route handlers
│   ├── middleware/         # Upload & error middleware
│   ├── routes/             # API routes (/api/ai, /api/project, /api/readme)
│   ├── services/           # AI & analysis services
│   ├── uploads/            # Temporary upload folder (.gitignored)
│   ├── temp/               # Temporary extraction folder (.gitignored)
│   └── server.js           # Main Express server
├── frontend/
│   ├── src/
│   │   ├── components/     # ToolInput, ToolOutput, Sidebar
│   │   ├── layouts/        # DashboardLayout
│   │   ├── pages/          # CommitPage, ErrorPage, ReadmePage, AnalyzerPage
│   │   ├── index.css       # Minimalist Black Design System
│   │   └── App.jsx         # Router & main application
│   └── package.json
├── .gitignore              # Ensures uploads/ and temp/ are never tracked
└── README.md
```

---

## Security & Upload Privacy

Uploaded ZIP files and extracted code directories are processed purely in memory/transient storage and immediately deleted from the filesystem (`src/uploads/` and `src/temp/`) upon completion of the analysis request. Furthermore, all upload and temporary directories are explicitly ignored in `.gitignore` to prevent repository tracking.

---

## License

ISC License
