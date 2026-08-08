import axios from "axios";

export const generateOpenRouterResponse = async (prompt, modelOverride) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const freeModels = [
    modelOverride,
    process.env.OPENROUTER_MODEL,
    "meta-llama/llama-3.2-11b-vision-instruct:free",
    "google/gemma-2-9b-it:free",
    "deepseek/deepseek-r1:free",
    "qwen/qwen-2.5-coder-32b-instruct:free",
    "mistralai/mistral-7b-instruct:free"
  ].filter(Boolean);

  let lastError = null;

  for (const model of freeModels) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:5000",
            "X-Title": "Toolzz",
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (text) {
        return { text, provider: "openrouter", model };
      }
    } catch (err) {
      lastError = err.response?.data || err.message;
      console.warn(`OpenRouter model ${model} failed:`, err.message);
    }
  }

  throw new Error(`OpenRouter failed: ${JSON.stringify(lastError)}`);
};
