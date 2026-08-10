import { generateGroqResponse } from "./providers/groq.provider.js";
import { generateOpenRouterResponse } from "./providers/openrouter.provider.js";
import { generateGeminiResponse } from "./providers/gemini.provider.js";
import { generateSmartFallback } from "../localFallback.service.js";

const PROVIDER_DRIVERS = {
  groq: generateGroqResponse,
  openrouter: generateOpenRouterResponse,
  gemini: generateGeminiResponse,
};

const sanitizeKey = (key) => (key || "").replace(/^["']|["']$/g, "").trim();
const isKeySet = (key) => sanitizeKey(key).length > 0;

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
      configured: isKeySet(process.env.GROQ_API_KEY),
    },
    {
      id: "openrouter",
      name: "OpenRouter (Free Models)",
      description: "Free cloud models (Llama 3.2, Gemma 2, DeepSeek R1).",
      isFree: true,
      configured: isKeySet(process.env.OPENROUTER_API_KEY),
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Google Gemini Free Tier models.",
      isFree: true,
      configured: isKeySet(process.env.GEMINI_API_KEY),
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
    if (p === "groq") return isKeySet(process.env.GROQ_API_KEY);
    if (p === "openrouter") return isKeySet(process.env.OPENROUTER_API_KEY);
    if (p === "gemini") return isKeySet(process.env.GEMINI_API_KEY);
    return false;
  };

  const configuredAttempts = attempts.filter(isConfigured);
  const unconfiguredAttempts = attempts.filter((p) => !isConfigured(p));
  const finalAttempts = Array.from(new Set([...configuredAttempts, ...unconfiguredAttempts]));

  for (const providerId of finalAttempts) {
    const driver = PROVIDER_DRIVERS[providerId];
    if (!driver) continue;

    try {
      console.log(`[AI Engine] Attempting generation with cloud provider: ${providerId}...`);
      const result = await driver(prompt, options.model);
      
      if (result && result.text && typeof result.text === "string" && result.text.trim()) {
        console.log(`[AI Engine] Successfully generated response using: ${result.provider} (${result.model})`);
        return result.text.trim();
      }
      
      throw new Error(`Provider '${providerId}' returned an empty text response.`);
    } catch (err) {
      lastError = err.message || err;
      console.warn(`[AI Engine] Provider '${providerId}' failed: ${lastError}`);
    }
  }

  console.warn(`[AI Engine] All cloud AI providers failed or were quota limited. Activating Smart Fallback Generator. Last error: ${lastError}`);
  return generateSmartFallback(options.tool, options.rawInput || prompt);
};
