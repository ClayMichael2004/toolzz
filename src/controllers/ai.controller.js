import { generateAIResponse, getAvailableProviders } from "../services/ai.service.js";
import { buildPrompt } from "../prompts/index.js";
import { generateFallbackScaffoldScript } from "../services/scaffold.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const handleAIRequest = asyncHandler(
  async (req, res) => {
    const { tool, input, provider } = req.body;
    const selectedProvider = provider || req.headers["x-ai-provider"] || "auto";

    if (!tool || !input) {
      return res.status(400).json({
        success: false,
        message: "tool and input are required"
      });
    }

    const prompt = buildPrompt(tool, input);
    let result;

    try {
      result = await generateAIResponse(prompt, { provider: selectedProvider });
    } catch (error) {
      console.warn("AI generation failed, checking for local fallback handler...", error.message);
      if (tool === "scaffold" || tool === "structure") {
        result = generateFallbackScaffoldScript(input);
      } else {
        throw error;
      }
    }

    if (!result || typeof result !== "string" || !result.trim()) {
      return res.status(500).json({
        success: false,
        message: "AI provider returned an empty response. Please try selecting a different AI agent in the sidebar."
      });
    }

    return successResponse(
      res,
      "Response generated successfully",
      {
        tool,
        result: result.trim(),
        provider: selectedProvider,
      }
    );
  }
);

export const getProvidersController = asyncHandler(
  async (req, res) => {
    const providers = getAvailableProviders();
    return successResponse(
      res,
      "Available AI providers fetched successfully",
      providers
    );
  }
);