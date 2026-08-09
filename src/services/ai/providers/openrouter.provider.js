import axios from "axios";

const sanitizeKey = (key) => (key || "").replace(/^["']|["']$/g, "").trim();

export const generateOpenRouterResponse = async (prompt, modelOverride) => {
  const apiKey = sanitizeKey(process.env.OPENROUTER_API_KEY);
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is missing or empty in Environment Variables.");
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
            "HTTP-Referer": "https://toolzz.onrender.com",
            "X-Title": "Toolzz AI",
            "Content-Type": "application/json",
          },
          timeout: 20000,
        }
      );

      const text = response.data?.choices?.[0]?.message?.content
        || response.data?.choices?.[0]?.text;

      if (text && typeof text === "string" && text.trim()) {
        return { text: text.trim(), provider: "openrouter", model };
      }
    } catch (err) {
      const errDetails = err.response?.data?.error?.message || err.response?.data || err.message;
      lastError = errDetails;
      console.warn(`[OpenRouter Provider] Model '${model}' failed:`, errDetails);
    }
  }

  throw new Error(`OpenRouter API Error: ${typeof lastError === "object" ? JSON.stringify(lastError) : lastError}`);
};
