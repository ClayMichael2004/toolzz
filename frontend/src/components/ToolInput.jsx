import { useState } from "react";

const ToolInput = ({ title, placeholder, onGenerate, loading }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;

    onGenerate(input);
  };

  return (
    <div>
      <h2>{title}</h2>

      <textarea
        rows="10"
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          marginTop: "10px",
          resize: "vertical",
        }}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default ToolInput;