import { useState } from "react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

function ReadmePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState("");
  const [notification, setNotification] = useState(null);

  const handleGenerate = async () => {
    if (!file) {
      setNotification({ type: "error", text: "Please choose a ZIP file to generate a README." });
      return;
    }

    const formData = new FormData();
    formData.append("project", file);

    try {
      setLoading(true);
      setNotification({ type: "info", text: "Generating your README — this may take a few moments." });

      const response = await api.post("/readme/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReadme(response.data.readme || "");
      setNotification({ type: "success", text: "README generated successfully." });
    } catch (error) {
      console.error(error);
      setNotification({ type: "error", text: "Failed to generate README. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const copyReadme = async () => {
    try {
      await navigator.clipboard.writeText(readme);
      setNotification({ type: "success", text: "README copied to clipboard." });
    } catch (error) {
      console.error(error);
      setNotification({ type: "error", text: "Unable to copy README. Please try again." });
    }
  };

  const downloadReadme = () => {
    const blob = new Blob([readme], {
      type: "text/markdown",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-panel">
            <div className="spinner" />
            <div>
              <p className="loading-title">Generating README</p>
              <p className="loading-copy">Analyzing your repository structure and creating a polished README.</p>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <p className="eyebrow">README Generator</p>
        <h1>Build a polished README instantly</h1>
        <p className="page-copy">
          Upload your project ZIP and let the AI craft a readable README that looks great and reflects the repo contents.
        </p>
      </div>

      <div className="tool-card">
        <div className="tool-card-header">
          <h2>Upload project ZIP</h2>
        </div>

        <div className="tool-actions upload-row">
          <label className="file-upload">
            <span>{file ? file.name : "Choose a .zip archive"}</span>
            <input type="file" accept=".zip" onChange={(e) => {
              setFile(e.target.files[0]);
              setNotification(null);
            }} />
          </label>

          <button className="button" onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating README..." : "Generate README"}
          </button>
        </div>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.text}
          </div>
        )}
      </div>

      {readme && (
        <div className="tool-card readme-card">
          <div className="tool-card-header">
            <h2>Preview</h2>
            <div className="tool-actions">
              <button className="button secondary" onClick={copyReadme}>Copy README</button>
              <button className="button secondary" onClick={downloadReadme}>Download README</button>
            </div>
          </div>
          <div className="readme-preview">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadmePage;
