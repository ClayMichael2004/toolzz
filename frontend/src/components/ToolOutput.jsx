import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Eye, Code, Download, TerminalSquare } from "lucide-react";

const CodeBlockWrapper = ({ code, lang, filename, children, onToast }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (onToast) onToast(`Copied ${filename} to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-block-lang">
          {lang.toUpperCase()} — {filename}
        </span>
        <div className="code-block-actions">
          <button type="button" className="button secondary" style={{ padding: "4px 10px", fontSize: "0.78rem" }} onClick={handleCopyCode}>
            {copied ? <Check size={13} style={{ color: "#34d399" }} /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy Script"}</span>
          </button>
          <button type="button" className="button secondary" style={{ padding: "4px 10px", fontSize: "0.78rem" }} onClick={handleDownloadCode}>
            <Download size={13} />
            <span>Download {filename}</span>
          </button>
        </div>
      </div>
      <pre>{children}</pre>
    </div>
  );
};

const ToolOutput = ({ output, title = "Generated Output", allowDownload = true, filename = "output.txt" }) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [viewMode, setViewMode] = useState("preview"); // "preview" | "raw"

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2200);
  };

  const handleCopyAll = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      triggerToast("Copied full output to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDownloadAll = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-card output-card">
      <div className="output-header">
        <div className="output-header-left">
          <h3>{title}</h3>
          {output && (
            <div className="output-view-mode">
              <button
                className={`mode-tab ${viewMode === "preview" ? "active" : ""}`}
                onClick={() => setViewMode("preview")}
                type="button"
              >
                <Eye size={13} style={{ display: "inline", marginRight: "4px" }} />
                Formatted
              </button>
              <button
                className={`mode-tab ${viewMode === "raw" ? "active" : ""}`}
                onClick={() => setViewMode("raw")}
                type="button"
              >
                <Code size={13} style={{ display: "inline", marginRight: "4px" }} />
                Raw Text
              </button>
            </div>
          )}
        </div>

        {output && (
          <div className="action-buttons">
            <button className="button secondary" onClick={handleCopyAll}>
              {copied ? (
                <>
                  <Check size={15} style={{ color: "#34d399" }} />
                  <span>Copied All</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Copy All</span>
                </>
              )}
            </button>

            {allowDownload && (
              <button className="button secondary" onClick={handleDownloadAll} title="Download file">
                <Download size={15} />
                <span>Download All</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="output-container">
        {output ? (
          viewMode === "preview" ? (
            <div className="markdown-body">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeText = String(children).replace(/\n$/, "");

                    if (inline || !match) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }

                    const lang = match[1].toLowerCase();
                    let scriptFilename = "script.txt";
                    if (lang === "bash" || lang === "sh" || lang === "shell") scriptFilename = "setup.sh";
                    else if (lang === "powershell" || lang === "ps1" || lang === "ps") scriptFilename = "setup.ps1";
                    else if (lang === "javascript" || lang === "js" || lang === "node") scriptFilename = "setup.js";
                    else if (lang === "python" || lang === "py") scriptFilename = "script.py";
                    else if (lang === "json") scriptFilename = "data.json";

                    return (
                      <CodeBlockWrapper
                        code={codeText}
                        lang={lang}
                        filename={scriptFilename}
                        onToast={triggerToast}
                      >
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </CodeBlockWrapper>
                    );
                  }
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className="output-raw">{output}</pre>
          )
        ) : (
          <div className="empty-state">
            <TerminalSquare className="empty-icon" />
            <p>No output generated yet. Enter your request above and click Generate.</p>
          </div>
        )}
      </div>

      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Check size={16} style={{ color: "#34d399" }} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolOutput;
