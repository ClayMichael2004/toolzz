import axios from "axios";

export const generateAIResponse = async (prompt) => {
  const models = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash"
  ].filter(Boolean);

  let lastError = null;

  for (const model of models) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        { timeout: 15000 }
      );

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
    } catch (error) {
      lastError = error.response?.data || error.message;
      console.error(`Gemini model ${model} failed:`, lastError);
    }
  }

  throw new Error(`Failed to generate AI response: ${JSON.stringify(lastError)}`);
};
