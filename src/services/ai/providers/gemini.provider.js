import axios from "axios";

const sanitizeKey = (key) => (key || "").replace(/^["']|["']$/g, "").trim();

export const generateGeminiResponse = async (prompt, modelOverride) => {
  const apiKey = sanitizeKey(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing or empty in Environment Variables.");
  }

  const models = [
    modelOverride,
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ].filter(Boolean);

  let lastError = null;

  for (const model of models) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        { timeout: 15000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
        || response.data?.candidates?.[0]?.text;

      if (text && typeof text === "string" && text.trim()) {
        return { text: text.trim(), provider: "gemini", model };
      }

      console.warn(`[Gemini Provider] Model '${model}' returned empty text structure.`);
    } catch (error) {
      const errDetails = error.response?.data?.error?.message || error.response?.data || error.message;
      lastError = errDetails;
      console.warn(`[Gemini Provider] Model '${model}' failed:`, errDetails);
    }
  }

  throw new Error(`Gemini API Error: ${typeof lastError === "object" ? JSON.stringify(lastError) : lastError}`);
};
