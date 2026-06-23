import { generateAIResponse } from "../services/ai.service.js";
import { buildPrompt } from "../prompts/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

export const handleAIRequest = asyncHandler(
    async(req, res)=> {
        const {tool, input}= req.body;

        if (!tool ||  !input){
            return res.status(400).json({
                success: false,
                message: "tool and input are required"
            });
        }
        const prompt = buildPrompt(tool, input);

        const result = await generateAIResponse(prompt);
        return successResponse(
            res, "AI response has been generated successfully",
            {tool,
            result,
        }
        );
    }
);
  