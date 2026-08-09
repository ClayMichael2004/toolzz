# Toolzz AI — Minimalist Developer Suite

Toolzz AI is a high-performance developer workspace designed to streamline workflow tasks including Git commit message generation, stack trace error diagnosis, automated README generation, folder structure scaffolding, and repository health analysis. Built with a matte obsidian black design system, zero clutter, clear non-overlapping outputs, and a **Multi-Agent AI Engine**.

---

## Key Features

- **Multi-Agent AI Engine (100% Free Cloud Providers)**:
  - **Auto (Smart Failover)**: Automatically retries across active free agents if rate limits (429) or errors occur.
  - **Groq API**: Blazing fast cloud inference (~500 tokens/sec) powered by Llama 3.3 70B.
  - **OpenRouter Free**: Access to open-weights free cloud models (`llama-3.2`, `gemma-2`, `deepseek-r1:free`).
  - **Google Gemini**: Gemini Free Tier models.
- **Folder Structure Scaffolder**: Paste any ASCII directory tree or text folder hierarchy to generate executable **Bash**, **PowerShell**, and **Node.js** setup scripts that automatically build the folders and files.
- **Git Commit Message Generator**: Convert messy diff notes or task descriptions into conventional, structured git commit messages.
- **Error Explainer & Fixer**: Paste stack traces or compiler error output to get root-cause diagnosis and actionable code resolutions.
- **Project Analyzer**: Perform automated health audits on repository ZIP archives to inspect code metrics, testing coverage, security controls, and quality scores.
- **README Generator**: Upload a repository ZIP archive to generate a structured `README.md` complete with tech stack badges, features, and setup commands.
- **Minimalist Black UI/UX**: Designed with a matte black aesthetic (`#09090b`), high-contrast typography (`Inter` & `JetBrains Mono`), sidebar agent selector dropdown, responsive navigation, and tabbed output viewing.
- **Privacy & Upload Hygiene**: All ZIP uploads and extracted temp files are automatically deleted after processing and excluded from Git tracking.

---

## Tech Stack

- **Frontend**: React 19, React Router v7, React Markdown, Lucide Icons, Vite
- **Backend**: Node.js, Express, Multer, Extract-Zip, Axios
- **AI Integrations**: Groq API, OpenRouter Free API, Google Gemini API

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

   # 1. Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here

   # 2. Groq API Key (100% Free - Fast Llama 3.3 70B)
   # Get free key: https://console.groq.com/keys
   GROQ_API_KEY=your_groq_api_key_here

   # 3. OpenRouter API Key (100% Free Cloud Models)
   # Get free key: https://openrouter.ai/keys
   OPENROUTER_API_KEY=your_openrouter_api_key_here
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

## Testing in Production / Deployment

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```
2. **Set Production Environment Variables**: Ensure `GROQ_API_KEY`, `OPENROUTER_API_KEY`, and `GEMINI_API_KEY` are configured on your deployment platform (e.g. Render, Vercel, Railway, AWS).
3. **Start Production Server**:
   ```bash
   npm start
   ```

---

## Repository Structure

```
toolzz/
├── src/
├── analyzer/           # Zip extraction & repository analysis logic
│   ├── controllers/        # Express route handlers
│   ├── middleware/         # Upload & error middleware
│   ├── routes/             # API routes (/api/ai, /api/project, /api/readme)
│   ├── services/           # AI services & Multi-Agent provider drivers
│   │   └── ai/             # Provider drivers (groq, openrouter, gemini, aiManager)
│   ├── uploads/            # Temporary upload folder (.gitignored)
│   ├── temp/               # Temporary extraction folder (.gitignored)
│   └── server.js           # Main Express server
├── frontend/
│   ├── src/
│   │   ├── components/     # ToolInput, ToolOutput, Sidebar, AgentSwitcher
│   │   ├── layouts/        # DashboardLayout
│   │   ├── pages/          # CommitPage, ErrorPage, ReadmePage, AnalyzerPage
│   │   ├── index.css       # Minimalist Black Design System
│   │   └── App.jsx         # Router & main application
│   └── package.json
├── .env.example            # Environment template for free AI providers
├── .gitignore              # Ensures uploads/ and temp/ are never tracked
└── README.md
```

---

## License

ISC License
