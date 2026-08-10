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
    "openrouter/free",
    "google/gemma-4-26b-a4b-it:free",
    "cohere/north-mini-code:free",
    "nvidia/nemotron-nano-9b-v2:free"
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
