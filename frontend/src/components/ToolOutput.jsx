import { useState } from "react";

const ToolOutput = ({ output }) => {
  const [copied, setCopied] = useState(false);

  const copytext = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div
      style={{
        marginTop: "25px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        minHeight: "200px",
        background: "#312e2e",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>AI Output</h3>
        {output && <button onClick={copytext}>Copy</button>}
      </div>

      {output ? (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            fontFamily: "inherit",
          }}
        >
          {output}
        </pre>
      ) : (
        <p>No output generated yet.</p>
      )}

      {copied && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "#333", color: "#fff", padding: "8px 16px", borderRadius: "4px", font: "14px sans-serif", zIndex: "9999" }}>
          Copied!
        </div>
      )}
    </div>
  );
};

export default ToolOutput;
