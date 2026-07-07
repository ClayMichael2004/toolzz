import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";

function CommitPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleGenerate = async (input) => {
    setMessage(null);
    setOutput("");

    try {
      setLoading(true);
      const result = await generateAI("commit", input);
      setOutput(result);
      setMessage({ type: "success", text: "Commit message ready." });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to generate a commit message right now. Please try again with a more detailed change description.",
      });
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
              <p className="loading-title">Generating commit message</p>
              <p className="loading-copy">Crafting polished Git history text for your changes.</p>
            </div>
          </div>
        </div>
      )}
      <div className="page-header">
        <p className="eyebrow">Commit Message Generator</p>
        <h1>Write polished commits in one pass</h1>
        <p className="page-copy">
          Paste your change summary, issue reference, or PR notes and get a professional commit message tailored for your git history.
        </p>
      </div>

      <ToolInput
        title="Describe the change"
        placeholder="Example: fix build error in auth middleware and update token validation"
        loading={loading}
        message={message}
        onGenerate={handleGenerate}
      />

      <ToolOutput output={output} title="Generated Commit Message" />
    </div>
  );
}

export default CommitPage;
