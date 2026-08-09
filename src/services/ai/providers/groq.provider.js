import axios from "axios";

export const generateGroqResponse = async (prompt, modelOverride) => {
  const apiKey = (process.env.GROQ_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing or empty in Environment Variables.");
  }

  const model = modelOverride || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Groq API returned an empty completion response.");
    }

    return { text, provider: "groq", model };
  } catch (error) {
    const errDetails = error.response?.data?.error?.message || error.response?.data || error.message;
    console.warn(`[Groq Provider] Failed:`, errDetails);
    throw new Error(`Groq API Error: ${typeof errDetails === "object" ? JSON.stringify(errDetails) : errDetails}`);
  }
};
