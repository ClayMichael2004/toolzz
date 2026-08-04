import { useState } from "react";
import { Sparkles, Trash2, AlertCircle } from "lucide-react";

const ToolInput = ({
  title,
  placeholder,
  onGenerate,
  loading,
  message,
  examples = []
}) => {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) {
      setValidationError("Please provide details before generating.");
      return;
    }

    setValidationError("");
    onGenerate(input);
  };

  const handleClear = () => {
    setInput("");
    setValidationError("");
  };

  return (
    <div className="tool-card">
      <div className="tool-card-header">
        <div className="tool-card-title">
          <h2>{title}</h2>
        </div>
        {input && (
          <button className="button ghost" onClick={handleClear} disabled={loading} title="Clear text">
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <textarea
        rows="8"
        value={input}
        placeholder={placeholder}
        onChange={(e) => {
          setInput(e.target.value);
          setValidationError("");
        }}
        className="tool-textarea"
      />

      {examples.length > 0 && (
        <div className="example-pills">
          {examples.map((example, idx) => (
            <button
              key={idx}
              type="button"
              className="example-pill"
              onClick={() => {
                setInput(example);
                setValidationError("");
              }}
            >
              + {example.slice(0, 45)}...
            </button>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <div className="action-buttons">
          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <div className="spinner" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {(message || validationError) && (
          <div className={`notification ${validationError ? "error" : message?.type || "info"}`}>
            <AlertCircle size={16} />
            <span>{validationError || message?.text}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolInput;