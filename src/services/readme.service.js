import axios from "axios";
import { buildReadmePrompt } from "./readmePromptBuilder.js";

export const generateReadme = async (report) => {
  try {
    const prompt = buildReadmePrompt(report);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      }
    );

    let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up surrounding ```markdown ... ``` wrapper if present
    rawText = rawText.trim();
    if (rawText.startsWith("```markdown")) {
      rawText = rawText.replace(/^```markdown\n?/, "").replace(/\n?```$/, "");
    } else if (rawText.startsWith("```md")) {
      rawText = rawText.replace(/^```md\n?/, "").replace(/\n?```$/, "");
    } else if (rawText.startsWith("```") && rawText.endsWith("```")) {
      rawText = rawText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    return rawText.trim();
  } catch (error) {
    console.error(
      "README Generation Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to generate README.");
  }
};