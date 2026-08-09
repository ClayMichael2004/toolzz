import { buildReadmePrompt } from "./readmePromptBuilder.js";
import { generateAIResponse } from "./ai.service.js";

export const generateReadme = async (report, provider) => {
  try {
    const prompt = buildReadmePrompt(report);
    let rawText = await generateAIResponse(prompt, { provider });

    // Clean up surrounding ```markdown ... ``` wrapper if present
    rawText = (rawText || "").trim();
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
      error.message
    );
    throw new Error(`Failed to generate README: ${error.message}`);
  }
};