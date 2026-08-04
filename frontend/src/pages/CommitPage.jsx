import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";
import { GitCommit } from "lucide-react";

function CommitPage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const samplePrompts = [
    "Fix build error in auth middleware and update JWT token validation logic",
    "Add dark mode toggle and improve responsive layout on mobile screens",
    "Refactor project analyzer service to improve ZIP extraction speed",
  ];

  const handleGenerate = async (input) => {
    setMessage(null);
    setOutput("");

    try {
      setLoading(true);
      const result = await generateAI("commit", input);
      setOutput(result);
      setMessage({ type: "success", text: "Commit message generated successfully." });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to generate commit message. Please describe your code changes in more detail.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">
          <GitCommit size={14} />
          <span>Git Tools</span>
        </div>
        <h1>Commit Message Generator</h1>
        <p className="page-copy">
          Paste your change summary, issue reference, or pull request notes to generate structured, conventional commit messages for your codebase.
        </p>
      </div>

      <ToolInput
        title="Describe code changes"
        placeholder="Example: added user authentication API endpoints and fixed token expiration bug in auth middleware..."
        loading={loading}
        message={message}
        onGenerate={handleGenerate}
        examples={samplePrompts}
      />

      <ToolOutput
        output={output}
        title="Generated Commit Message"
        filename="commit-message.txt"
      />
    </div>
  );
}

export default CommitPage;
