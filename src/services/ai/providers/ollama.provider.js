import axios from "axios";

export const generateOllamaResponse = async (prompt, modelOverride) => {
  const host = process.env.OLLAMA_HOST || "http://localhost:11434";
  const model = modelOverride || process.env.OLLAMA_MODEL || "qwen2.5-coder";

  try {
    const response = await axios.post(
      `${host}/api/generate`,
      {
        model,
        prompt,
        stream: false,
      },
      {
        timeout: 60000, // Local generation may take longer on CPU
      }
    );

    const text = response.data?.response;
    if (!text) {
      throw new Error("Ollama returned empty response.");
    }

    return { text, provider: "ollama", model };
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      throw new Error(`Ollama local server is not running on ${host}. Start Ollama locally to use offline AI.`);
    }
    throw new Error(`Ollama generation failed: ${error.response?.data?.error || error.message}`);
  }
};
