import { useState } from "react";
import api from "../services/api";

const scoreToPercentage = (value) => Math.min(100, Math.max(0, value || 0));

const AnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please upload a ZIP file to analyze your project." });
      return;
    }

    const formData = new FormData();
    formData.append("project", file);

    try {
      setLoading(true);
      setMessage({ type: "info", text: "Analyzing project structure and quality metrics..." });

      const response = await api.post("/project/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        setAnalysis(response.data.analysis);
        setMessage({ type: "success", text: "Project analysis completed successfully." });
      } else {
        setAnalysis(null);
        setMessage({ type: "error", text: response.data?.message || "Project analysis failed. Please try a valid ZIP file." });
      }
    } catch (error) {
      console.error(error);
      setAnalysis(null);
      setMessage({ type: "error", text: "Unable to analyze the project. Check that the ZIP contains a valid codebase." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page analyzer-page">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-panel">
            <div className="spinner" />
            <div>
              <p className="loading-title">Analyzing your repository</p>
              <p className="loading-copy">Inspecting structure, security, docs, testing, and architecture.</p>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <div>
          <p className="eyebrow">Project Analyzer</p>
          <h1>Inspect your repository in seconds</h1>
          <p className="page-copy">
            Upload a project ZIP to review its health, documentation, security posture, testing coverage, and architecture.
          </p>
        </div>
      </div>

      <div className="tool-card upload-card">
        <div className="upload-row">
          <label className="file-upload">
            <span>{file ? file.name : "Select a ZIP file"}</span>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setMessage(null);
              }}
            />
          </label>

          <button className="button" onClick={handleUpload} disabled={loading}>
            {loading ? (
              <span className="button-loading">Analyzing...</span>
            ) : (
              "Analyze Project"
            )}
          </button>
        </div>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      {analysis && (
        <div className="analysis-results">
          <section className="summary-grid">
            <div className="summary-card score-card">
              <p className="eyebrow">Overall Health</p>
              <h2>{analysis.summary.overallScore || 0}</h2>
              <p className="card-copy">Quality score based on documentation, security, testing and maintainability.</p>
            </div>
            <div className="summary-card project-card">
              <p className="eyebrow">Project</p>
              <h3>{analysis.summary.projectName || "Untitled"}</h3>
              <p>{analysis.summary.language || "Unknown language"}</p>
            </div>
            <div className="summary-card metric-card">
              <p className="eyebrow">Size</p>
              <div className="metric-row">
                <span>{analysis.metrics.files || 0} files</span>
                <span>{analysis.metrics.folders || 0} folders</span>
              </div>
            </div>
          </section>

          <section className="dashboard-grid">
            <div className="status-card">
              <div className="card-header">
                <h3>Quality metrics</h3>
                <span className="badge">Score</span>
              </div>
              <div className="stat-list">
                {[
                  { label: "Documentation", value: analysis.quality.documentation },
                  { label: "Security", value: analysis.quality.security },
                  { label: "Testing", value: analysis.quality.testing },
                  { label: "Maintainability", value: analysis.quality.maintainability },
                ].map((item) => (
                  <div className="stat-item" key={item.label}>
                    <div className="stat-title">{item.label}</div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${scoreToPercentage(item.value)}%` }}
                      />
                    </div>
                    <span className="stat-value">{item.value || 0}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Tech stack</h3>
              </div>
              <div className="tech-grid">
                {Object.entries(analysis.techStack || {}).map(([key, value]) => (
                  <div className="tech-item" key={key}>
                    <p>{key.replace(/([A-Z])/g, " $1").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                    <strong>{value || "N/A"}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Documentation</h3>
              </div>
              <div className="badge-list">
                {Object.entries(analysis.documentation || {}).map(([key, present]) => (
                  <span
                    className={`badge ${present ? "success" : "muted"}`}
                    key={key}
                  >
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>

            <div className="status-card">
              <div className="card-header">
                <h3>Security checks</h3>
              </div>
              <div className="badge-list">
                {Object.entries(analysis.security || {}).map(([key, present]) => (
                  <span
                    className={`badge ${present ? "success" : "muted"}`}
                    key={key}
                  >
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {analysis.recommendations?.length > 0 && (
            <section className="recommendations-card">
              <div className="card-header">
                <h3>Recommendations</h3>
              </div>
              <ul>
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={`${recommendation}-${index}`}>{recommendation}</li>
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
