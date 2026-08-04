import { useState } from "react";
import ToolInput from "../components/ToolInput";
import ToolOutput from "../components/ToolOutput";
import { generateAI } from "../services/api";
import { AlertOctagon } from "lucide-react";

const ErrorPage = () => {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const sampleErrors = [
    "TypeError: Cannot read properties of undefined (reading 'map') at UserList.jsx:24",
    "UnhandledPromiseRejection: Error: connect ECONNREFUSED 127.0.0.1:5432 at TCPConnectWrap.afterConnect",
    "CORS policy error: No 'Access-Control-Allow-Origin' header is present on the requested resource",
  ];

  const handleGenerate = async (input) => {
    setMessage(null);
    setOutput("");

    try {
      setLoading(true);
      const result = await generateAI("error", input);
      setOutput(result);
      setMessage({ type: "success", text: "Error analysis ready." });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Unable to analyze error. Please ensure you provided a valid stack trace or error log.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="eyebrow">
          <AlertOctagon size={14} />
          <span>Debugging Assistant</span>
        </div>
        <h1>Error Explainer & Fixer</h1>
        <p className="page-copy">
          Paste stack traces, compiler output, or runtime errors to diagnose root causes and get clear code solutions.
        </p>
      </div>

      <ToolInput
        title="Paste error output or stack trace"
        placeholder="Paste your exception trace or error logs here..."
        loading={loading}
        message={message}
        onGenerate={handleGenerate}
        examples={sampleErrors}
      />

      <ToolOutput
        output={output}
        title="Diagnosis & Resolution"
        filename="error-fix.md"
      />
    </div>
  );
};

export default ErrorPage;
