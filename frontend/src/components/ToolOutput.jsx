import { useState } from "react";

const ToolOutput = ({ output, title = "AI Output" }) => {
  const [copied, setCopied] = useState(false);

  const copytext = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-card output-card">
      <div className="output-header">
        <div>
          <h3>{title}</h3>
        </div>
        {output && (
          <button className="button secondary" onClick={copytext}>
            Copy result
          </button>
        )}
      </div>

      {output ? (
        <pre className="output-box">{output}</pre>
      ) : (
        <div className="empty-state">No output yet. Generate content to see the result here.</div>
      )}

      {copied && <div className="toast">Copied to clipboard</div>}
    </div>
  );
};

export default ToolOutput;
