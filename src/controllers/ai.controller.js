import { generateAIResponse } from "../services/ai.service.js";
import { buildPrompt } from "../prompts/index.js";
import { generateFallbackScaffoldScript } from "../services/scaffold.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const handleAIRequest = asyncHandler(
  async (req, res) => {
    const { tool, input } = req.body;

    if (!tool || !input) {
      return res.status(400).json({
        success: false,
        message: "tool and input are required"
      });
    }

    const prompt = buildPrompt(tool, input);
    let result;

    try {
      result = await generateAIResponse(prompt);
    } catch (error) {
      console.warn("AI generation failed, checking for local fallback handler...", error.message);
      if (tool === "scaffold" || tool === "structure") {
        result = generateFallbackScaffoldScript(input);
      } else {
        throw error;
      }
    }

    return successResponse(
      res,
      "Response generated successfully",
      {
        tool,
        result,
      }
    );
  }
);