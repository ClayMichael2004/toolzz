import { generateAIResponse, getAvailableProviders } from "../services/ai.service.js";
import { buildPrompt } from "../prompts/index.js";
import { generateSmartFallback } from "../services/localFallback.service.js";
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
      result = await generateAIResponse(prompt, { provider: selectedProvider, tool, rawInput: input });
    } catch (error) {
      console.warn("Cloud AI generation failed, using local smart fallback...", error.message);
      result = generateSmartFallback(tool, input);
    }

    if (!result || typeof result !== "string" || !result.trim()) {
      result = generateSmartFallback(tool, input);
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