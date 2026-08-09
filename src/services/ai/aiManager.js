import { generateGroqResponse } from "./providers/groq.provider.js";
import { generateOpenRouterResponse } from "./providers/openrouter.provider.js";
import { generateGeminiResponse } from "./providers/gemini.provider.js";

const PROVIDER_DRIVERS = {
  groq: generateGroqResponse,
  openrouter: generateOpenRouterResponse,
  gemini: generateGeminiResponse,
};

export const getAvailableProviders = () => {
  return [
    {
      id: "auto",
      name: "Auto (Smart Failover)",
      description: "Auto switches between Groq, OpenRouter, and Gemini on rate limits",
      isFree: true,
      configured: true,
    },
    {
      id: "groq",
      name: "Groq (Llama 3.3 70B)",
      description: "Blazing fast cloud inference (~500 tokens/sec). Free tier.",
      isFree: true,
      configured: Boolean(process.env.GROQ_API_KEY),
    },
    {
      id: "openrouter",
      name: "OpenRouter (Free Models)",
      description: "Free cloud models (Llama 3.2, Gemma 2, DeepSeek R1).",
      isFree: true,
      configured: Boolean(process.env.OPENROUTER_API_KEY),
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Google Gemini Free Tier models.",
      isFree: true,
      configured: Boolean(process.env.GEMINI_API_KEY),
    },
  ];
};

export const generateAIResponse = async (prompt, options = {}) => {
  const requestedProvider = (options.provider || "auto").toLowerCase();
  let lastError = null;

  // Cloud Free Waterfall order: Groq -> OpenRouter -> Gemini
  const defaultWaterfallOrder = ["groq", "openrouter", "gemini"];
  
  let attempts = [];
  if (requestedProvider !== "auto" && PROVIDER_DRIVERS[requestedProvider]) {
    attempts = [
      requestedProvider,
      ...defaultWaterfallOrder.filter((p) => p !== requestedProvider),
    ];
  } else {
    attempts = [...defaultWaterfallOrder];
  }

  // Filter down to providers with configured keys
  const isConfigured = (p) => {
    if (p === "groq") return Boolean(process.env.GROQ_API_KEY);
    if (p === "openrouter") return Boolean(process.env.OPENROUTER_API_KEY);
    if (p === "gemini") return Boolean(process.env.GEMINI_API_KEY);
    return false;
  };

  const configuredAttempts = attempts.filter(isConfigured);
  const finalAttempts = configuredAttempts.length > 0 ? configuredAttempts : attempts;

  for (const providerId of finalAttempts) {
    const driver = PROVIDER_DRIVERS[providerId];
    if (!driver) continue;

    try {
      console.log(`[AI Engine] Attempting generation with cloud provider: ${providerId}...`);
      const result = await driver(prompt, options.model);
      console.log(`[AI Engine] Successfully generated response using: ${result.provider} (${result.model})`);
      return result.text;
    } catch (err) {
      lastError = err.message || err;
      console.warn(`[AI Engine] Provider '${providerId}' failed: ${lastError}`);
    }
  }

  throw new Error(`All active AI agents failed to respond. Last error: ${lastError}`);
};
