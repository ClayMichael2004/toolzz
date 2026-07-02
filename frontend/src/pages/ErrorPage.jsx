import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";

const ErrorPage = () => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input) => {
    try {
      setLoading(true);

      const result = await generateAI("error", input);

      setOutput(result);
    } catch (error) {
      console.error(error);
      setOutput("Failed to explain the error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToolInput
        title="Error Explainer"
        placeholder="Paste your error message or stack trace here..."
        loading={loading}
        onGenerate={handleGenerate}
      />

      <ToolOutput output={output} />
    </>
  );
};

export default ErrorPage;
