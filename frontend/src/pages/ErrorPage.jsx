import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";

const ErrorPage = () => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerate = async (input) => {
    setMessage(null);

    try {
      setLoading(true);

      const result = await generateAI("error", input);
      setOutput(result);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Unable to explain the error right now. Please try again." });
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
              <p className="loading-title">Explaining your error</p>
              <p className="loading-copy">Analyzing the stack trace and preparing a clear, readable answer.</p>
            </div>
          </div>
        </div>
      )}
      <ToolInput
        title="Error Explainer"
        placeholder="Paste your error message or stack trace here..."
        loading={loading}
        message={message}
        onGenerate={handleGenerate}
      />
      <ToolOutput output={output} title="Error Explanation" />
    </div>
  );
};

export default ErrorPage;
