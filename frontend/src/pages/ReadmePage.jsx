import { useState } from "react";
import ToolOutput from "../components/ToolOutput";
import api from "../services/api";
import { FileText, UploadCloud, FileArchive, CheckCircle2, AlertCircle } from "lucide-react";

function ReadmePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [readme, setReadme] = useState("");
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.endsWith(".zip")) {
      setNotification({ type: "error", text: "Only .zip archive files are supported." });
      return;
    }
    setFile(selectedFile);
    setNotification(null);
  };

  const handleGenerate = async () => {
    if (!file) {
      setNotification({ type: "error", text: "Please upload a project ZIP file first." });
      return;
    }

    const formData = new FormData();
    formData.append("project", file);
    formData.append("provider", localStorage.getItem("toolzz_selected_agent") || "auto");

    try {
      setLoading(true);
      setNotification({ type: "info", text: "Analyzing codebase & generating README documentation..." });

      const response = await api.post("readme/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.readme) {
        setReadme(response.data.readme);
        setNotification({ type: "success", text: "README.md generated successfully." });
      } else {
        setNotification({ type: "error", text: "Failed to parse repository for README generation." });
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "Unable to generate README. Check that your ZIP archive is valid.";
      setNotification({ type: "error", text: errMsg });
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
              <p className="loading-title">Generating README</p>
              <p className="loading-copy">Inspecting files, dependencies, and structure to build documentation...</p>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="eyebrow">
          <FileText size={14} />
          <span>Documentation Engine</span>
        </div>
        <h1>README Generator</h1>
        <p className="page-copy">
          Upload a project ZIP file to automatically analyze code structure, detect stack technologies, and build a professional README.md.
        </p>
      </div>

      <div className="tool-card">
        <div className="tool-card-header">
          <h2>Upload Project Workspace</h2>
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
              {file ? file.name : "Click to select or drag & drop a ZIP file"}
            </p>
            <p className="dropzone-subtext">Supports .zip archives containing project source code (Max: 100MB)</p>
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
          <button className="button" onClick={handleGenerate} disabled={loading || !file}>
            {loading ? "Generating..." : "Generate README"}
          </button>

          {notification && (
            <div className={`notification ${notification.type}`}>
              <AlertCircle size={16} />
              <span>{notification.text}</span>
            </div>
          )}
        </div>
      </div>

      <ToolOutput
        output={readme}
        title="Generated README.md"
        filename="README.md"
        allowDownload={true}
      />
    </div>
  );
}

export default ReadmePage;
