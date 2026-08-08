import axios from "axios";

export const generateGitHubResponse = async (prompt, modelOverride) => {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured.");
  }

  const model = modelOverride || process.env.GITHUB_MODEL || "Meta-Llama-3.3-70B-Instruct";

  const response = await axios.post(
    "https://models.inference.ai.azure.com/chat/completions",
    {
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 20000,
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("GitHub Models returned empty response.");
  }

  return { text, provider: "github", model };
};
