import { useState } from "react";

const ToolInput = ({ title, placeholder, onGenerate, loading, message }) => {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) {
      setValidationError("Enter a description or error text to generate a response.");
      return;
    }

    setValidationError("");
    onGenerate(input);
  };

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <h2>{title}</h2>
      </div>

      <textarea
        rows="10"
        value={input}
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.target.value);
          setValidationError("");
        }}
        className="tool-textarea"
      />

      <div className="tool-actions">
        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>

        {(message || validationError) && (
          <div className={`notification ${validationError ? "error" : message?.type || "info"}`}>
            {validationError || message?.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolInput;