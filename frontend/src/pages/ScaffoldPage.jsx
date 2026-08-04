import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";
import { FolderTree, Terminal, Shield, FileCode, Copy, Download, Check } from "lucide-react";

function ScaffoldPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "bash" | "ps" | "node"
  const [copiedScript, setCopiedScript] = useState("");

  const sampleStructures = [
    `my-app/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── server.js
├── .env.example
├── package.json
└── README.md`,

    `fastapi-project/
├── app/
│   ├── api/
│   │   └── endpoints.py
│   ├── core/
│   │   └── config.py
│   └── main.py
├── tests/
│   └── test_api.py
├── requirements.txt
└── Dockerfile`,

    `react-client/
src/
  assets/
  components/
    Navbar.jsx
    Footer.jsx
  pages/
    Home.jsx
    Dashboard.jsx
  App.jsx
  main.jsx
public/
  favicon.ico
index.html
package.json`
  ];

  const handleGenerate = async (input) => {
    setMessage(null);
    setOutput("");
    setActiveTab("all");

    try {
      setLoading(true);
      const result = await generateAI("scaffold", input);
      setOutput(result);
      setMessage({ type: "success", text: "Scaffolding scripts generated for Linux, Windows & Node.js." });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to generate scaffolding script. Please check your folder structure format.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract specific code blocks from output
  const extractCode = (langPattern) => {
    if (!output) return "";
    const regex = new RegExp(`\`\`\`(?:${langPattern})\\n([\\s\\S]*?)\`\`\``, "i");
    const match = output.match(regex);
    return match ? match[1].trim() : "";
  };

  const bashCode = extractCode("bash|sh");
  const psCode = extractCode("powershell|ps1|ps");
  const nodeCode = extractCode("javascript|js|node");

  const handleCopyScript = async (text, name) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(name);
      setTimeout(() => setCopiedScript(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadScript = (text, filename) => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">
          <FolderTree size={14} />
          <span>Developer Automation</span>
        </div>
        <h1>Folder Structure Scaffolder</h1>
        <p className="page-copy">
          Paste any directory tree or text structure to automatically generate executable <strong>Linux (Bash)</strong>, <strong>Windows (PowerShell)</strong>, and <strong>Node.js</strong> scripts to create the entire folder hierarchy in one command.
        </p>
      </div>

      <ToolInput
        title="Paste folder structure or ASCII tree"
        placeholder="Paste your folder tree here...
Example:
src/
  controllers/
    user.controller.js
  routes/
    user.routes.js
  app.js
.env.example
package.json"
        loading={loading}
        message={message}
        onGenerate={handleGenerate}
        examples={sampleStructures}
      />

      {output && (
        <div className="tool-card">
          <div className="output-header">
            <h3>Quick OS Script Selector</h3>
            <div className="output-view-mode">
              <button
                className={`mode-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
                type="button"
              >
                All Documentation
              </button>
              {bashCode && (
                <button
                  className={`mode-tab ${activeTab === "bash" ? "active" : ""}`}
                  onClick={() => setActiveTab("bash")}
                  type="button"
                >
                  <Terminal size={13} style={{ marginRight: 4 }} /> Linux / macOS (setup.sh)
                </button>
              )}
              {psCode && (
                <button
                  className={`mode-tab ${activeTab === "ps" ? "active" : ""}`}
                  onClick={() => setActiveTab("ps")}
                  type="button"
                >
                  <Shield size={13} style={{ marginRight: 4 }} /> Windows (setup.ps1)
                </button>
              )}
              {nodeCode && (
                <button
                  className={`mode-tab ${activeTab === "node" ? "active" : ""}`}
                  onClick={() => setActiveTab("node")}
                  type="button"
                >
                  <FileCode size={13} style={{ marginRight: 4 }} /> Node.js (setup.js)
                </button>
              )}
            </div>
          </div>

          {activeTab === "bash" && bashCode && (
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-lang">Linux / macOS Bash Script — setup.sh</span>
                <div className="code-block-actions">
                  <button type="button" className="button secondary" onClick={() => handleCopyScript(bashCode, "bash")}>
                    {copiedScript === "bash" ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
                    <span>{copiedScript === "bash" ? "Copied" : "Copy setup.sh"}</span>
                  </button>
                  <button type="button" className="button secondary" onClick={() => handleDownloadScript(bashCode, "setup.sh")}>
                    <Download size={13} />
                    <span>Download setup.sh</span>
                  </button>
                </div>
              </div>
              <pre className="output-raw">{bashCode}</pre>
            </div>
          )}

          {activeTab === "ps" && psCode && (
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-lang">Windows PowerShell Script — setup.ps1</span>
                <div className="code-block-actions">
                  <button type="button" className="button secondary" onClick={() => handleCopyScript(psCode, "ps")}>
                    {copiedScript === "ps" ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
                    <span>{copiedScript === "ps" ? "Copied" : "Copy setup.ps1"}</span>
                  </button>
                  <button type="button" className="button secondary" onClick={() => handleDownloadScript(psCode, "setup.ps1")}>
                    <Download size={13} />
                    <span>Download setup.ps1</span>
                  </button>
                </div>
              </div>
              <pre className="output-raw">{psCode}</pre>
            </div>
          )}

          {activeTab === "node" && nodeCode && (
            <div className="code-block-wrapper">
              <div className="code-block-header">
                <span className="code-block-lang">Node.js Cross-Platform Script — setup.js</span>
                <div className="code-block-actions">
                  <button type="button" className="button secondary" onClick={() => handleCopyScript(nodeCode, "node")}>
                    {copiedScript === "node" ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
                    <span>{copiedScript === "node" ? "Copied" : "Copy setup.js"}</span>
                  </button>
                  <button type="button" className="button secondary" onClick={() => handleDownloadScript(nodeCode, "setup.js")}>
                    <Download size={13} />
                    <span>Download setup.js</span>
                  </button>
                </div>
              </div>
              <pre className="output-raw">{nodeCode}</pre>
            </div>
          )}

          {activeTab === "all" && (
            <ToolOutput
              output={output}
              title="Full Documentation & Scripts"
              filename="setup-scaffold.md"
            />
          )}

          <div style={{ marginTop: "20px", padding: "16px 20px", background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
            <h4 style={{ fontSize: "0.92rem", marginBottom: "10px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Terminal size={15} /> Quick Terminal Execution Guide
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px", fontSize: "0.83rem", color: "var(--text-secondary)" }}>
              <div>
                <strong style={{ color: "#38bdf8" }}>Linux / macOS (Bash)</strong>
                <pre style={{ margin: "4px 0 0", padding: "8px 12px", background: "#050507", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  chmod +x setup.sh && ./setup.sh
                </pre>
              </div>
              <div>
                <strong style={{ color: "#38bdf8" }}>Windows (PowerShell)</strong>
                <pre style={{ margin: "4px 0 0", padding: "8px 12px", background: "#050507", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  .\setup.ps1
                </pre>
              </div>
              <div>
                <strong style={{ color: "#38bdf8" }}>Cross-Platform (Node.js)</strong>
                <pre style={{ margin: "4px 0 0", padding: "8px 12px", background: "#050507", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>
                  node setup.js
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScaffoldPage;
