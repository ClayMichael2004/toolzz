import { useState } from "react";
import api from "../services/api";
import { BarChart3, UploadCloud, FileArchive, ShieldCheck, FileCheck, CheckCircle2, AlertCircle, Cpu, Sparkles, Terminal, Key, FolderTree } from "lucide-react";

const scoreToPercentage = (value) => Math.min(100, Math.max(0, value || 0));
const displayTechValue = (value) => value && value !== "Not detected" && value !== "Unknown" ? value : "Not detected";
const hasTechSignals = (techStack) =>
  Object.values(techStack || {}).some((value) => value && value !== "Not detected" && value !== "Unknown");

const AnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".zip")) {
      setMessage({ type: "error", text: "Please select a valid ZIP archive." });
      return;
    }
    setFile(selectedFile);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please upload a project ZIP file to analyze." });
      return;
    }

    const formData = new FormData();
    formData.append("project", file);

    try {
      setLoading(true);
      setMessage({ type: "info", text: "Performing deep scan on repository architecture, manifests, and safety..." });

      const response = await api.post("project/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setAnalysis(response.data.analysis);
        setMessage({ type: "success", text: "Deep project analysis completed." });
      } else {
        setAnalysis(null);
        setMessage({ type: "error", text: response.data?.message || "Analysis failed. Please check your ZIP file." });
      }
    } catch (error) {
      console.error(error);
      setAnalysis(null);
      setMessage({ type: "error", text: "Unable to analyze project. Please ensure the ZIP archive contains valid source code." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-panel">
            <div className="spinner" />
            <div>
              <p className="loading-title">Deep Scanning Repository</p>
              <p className="loading-copy">Rinsing ZIP file: parsing manifests, env variables, entry points & architecture...</p>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="eyebrow">
          <BarChart3 size={14} />
          <span>Code Intelligence</span>
        </div>
        <h1>Deep Project Analyzer</h1>
        <p className="page-copy">
          Thoroughly inspect codebase architecture, polyglot dependencies, environment variable requirements, execution scripts, and safety metrics.
        </p>
      </div>

      <div className="tool-card">
        <div className="tool-card-header">
          <h2>Select Repository Archive</h2>
        </div>

        <label
          className={`file-dropzone ${isDragging ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileChange(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            type="file"
            accept=".zip"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e.target.files[0])}
          />

          <div className="dropzone-icon">
            <UploadCloud size={24} />
          </div>

          <div>
            <p className="dropzone-text">
              {file ? file.name : "Click to choose or drag & drop project ZIP archive"}
            </p>
            <p className="dropzone-subtext">Deep multi-ecosystem analysis (Node.js, Python, Go, Rust, Java, PHP, C#)</p>
          </div>

          {file && (
            <div className="file-selected-badge">
              <FileArchive size={16} />
              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              <CheckCircle2 size={16} style={{ color: "#34d399" }} />
            </div>
          )}
        </label>

        <div className="tool-actions">
          <button className="button" onClick={handleUpload} disabled={loading || !file}>
            {loading ? "Analyzing..." : "Analyze Repository"}
          </button>

          {message && (
            <div className={`notification ${message.type}`}>
              <AlertCircle size={16} />
              <span>{message.text}</span>
            </div>
          )}
        </div>
      </div>

      {analysis && (
        <div className="page" style={{ gap: "20px" }}>
          <section className="summary-grid">
            <div className="metric-card">
              <span className="eyebrow">Overall Health</span>
              <div className="score-display">{analysis.summary.overallScore || 0}</div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
                Quality index based on testing, docs, security & maintainability.
              </p>
            </div>

            <div className="metric-card">
              <span className="eyebrow">Project Profile</span>
              <h3 style={{ fontSize: "1.25rem", marginTop: "6px" }}>{analysis.summary.projectName || "Untitled Project"}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                Primary Language: <strong>{analysis.summary.language || "Unknown"}</strong>
              </p>

              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Package Manager: <strong>{analysis.summary.packageManager || "N/A"}</strong>
              </p>
            </div>

            <div className="metric-card">
              <span className="eyebrow">Repository Scale</span>
              <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {analysis.metrics?.files || 0}
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Files</span>
                </div>
                <div style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: "16px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {analysis.metrics?.folders || 0}
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Folders</span>
                </div>
                <div style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: "16px" }}>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                    {analysis.metrics?.testFiles || 0}
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Test Files</span>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="status-card">
              <div className="card-header">
                <h3>Quality Breakdown</h3>
                <ShieldCheck size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="stat-list">
                {[
                  { label: "Documentation", value: analysis.quality?.documentation },
                  { label: "Security & Safety", value: analysis.quality?.security },
                  { label: "Testing Coverage", value: analysis.quality?.testing },
                  { label: "Maintainability", value: analysis.quality?.maintainability },
                ].map((item) => (
                  <div className="stat-item" key={item.label}>
                    <div className="stat-title">
                      <span>{item.label}</span>
                      <span className="stat-value-num">{item.value || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${scoreToPercentage(item.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Detected Tech Stack</h3>
                <Cpu size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="tech-grid">
                {Object.entries(analysis.techStack || {}).map(([key, value]) => (
                  <div className="tech-item" key={key}>
                    <span className="tech-label">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="tech-val">{displayTechValue(value)}</span>
                  </div>
                ))}
              </div>
              {!hasTechSignals(analysis.techStack) && (
                <div className="notification info" style={{ marginTop: "12px" }}>
                  <span>No explicit tech stack dependencies detected in manifests.</span>
                </div>
              )}
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Architecture Pattern</h3>
                <FolderTree size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  {analysis.architecture?.architecture || "Standard Architecture"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {(analysis.architecture?.reasons || []).join(" ")}
                </div>
                {analysis.entryPoints?.length > 0 && (
                  <div style={{ marginTop: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Entry Points: <code style={{ color: "var(--text-primary)" }}>{analysis.entryPoints.join(", ")}</code>
                  </div>
                )}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Environment Variables</h3>
                <Key size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              {analysis.environment?.requiredVars?.length > 0 ? (
                <div className="badge-list">
                  {analysis.environment.requiredVars.map((v) => (
                    <span className="badge muted" key={v} style={{ fontFamily: "var(--font-mono)" }}>
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  No required environment variables declared in <code>.env.example</code> or <code>.env</code>.
                </p>
              )}
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Documentation Audit</h3>
                <FileCheck size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="badge-list">
                {Object.entries(analysis.documentation || {})
                  .filter(([key]) => key !== "score")
                  .map(([key, present]) => (
                    <span
                      className={`badge ${present ? "success" : "muted"}`}
                      key={key}
                    >
                      {present ? "✓" : "✗"} {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                    </span>
                  ))}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Security & Environment Controls</h3>
                <ShieldCheck size={18} style={{ color: "var(--text-muted)" }} />
              </div>
              <div className="badge-list">
                {Object.entries(analysis.security || {})
                  .filter(([key]) => key !== "score")
                  .map(([key, present]) => (
                    <span
                      className={`badge ${present ? "success" : "muted"}`}
                      key={key}
                    >
                      {present ? "✓" : "✗"} {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                    </span>
                  ))}
              </div>
            </div>
          </section>

          {Object.keys(analysis.scripts || {}).length > 0 && (
            <section className="status-card">
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Terminal size={18} style={{ color: "var(--text-primary)" }} />
                  <h3>Manifest Execution Scripts</h3>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
                {Object.entries(analysis.scripts).map(([script, command]) => (
                  <div className="tech-item" key={script}>
                    <span className="tech-label" style={{ fontFamily: "var(--font-mono)", color: "#38bdf8" }}>{script}</span>
                    <code style={{ fontSize: "0.82rem", background: "transparent", border: "none", padding: 0 }}>{command}</code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {analysis.recommendations?.length > 0 && (
            <section className="recommendations-card">
              <div className="card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Sparkles size={18} style={{ color: "var(--accent-white)" }} />
                  <h3>Actionable Recommendations</h3>
                </div>
              </div>
              <ul>
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyzerPage;
