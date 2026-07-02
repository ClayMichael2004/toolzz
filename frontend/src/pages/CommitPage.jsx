import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";

const CommitPage = () => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input) => {
    try {
      setLoading(true);

      const result = await generateAI("commit", input);

      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput("Failed to generate commit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToolInput
        title="Commit Message Generator"
        placeholder="Describe the changes you made..."
        loading={loading}
        onGenerate={handleGenerate}
      />

      <ToolOutput output={output} />
    </>
  );
};

export default CommitPage;
