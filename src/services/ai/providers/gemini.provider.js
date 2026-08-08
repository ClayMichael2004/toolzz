import axios from "axios";

export const generateGeminiResponse = async (prompt, modelOverride) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const models = [
    modelOverride,
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash"
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

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return { text, provider: "gemini", model };
      }
    } catch (error) {
      lastError = error.response?.data || error.message;
      console.warn(`Gemini model ${model} failed:`, error.message);
    }
  }

  throw new Error(`Gemini failed: ${JSON.stringify(lastError)}`);
};
