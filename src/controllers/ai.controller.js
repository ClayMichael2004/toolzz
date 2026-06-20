import { generateAIResponse } from "../services/ai.service";
import { buildPrompt } from "../prompts/index.js";

export const handleAIRequest = async (req, res)=> {
    try{
        const {tool, input}= req.body;

        if (!tool || !input){
            return res.status(400).json({
                error: "tool and input are required",
            });
        }

        const prompt = buildPrompt(tool, input);

        const result = await generateAIResponse(prompt);

        res.json({
            tool,
            result,
        });
    }catch (error){
        res.status(500).json({
            error: "Server error",
            details: error.message,
        });
    }
};
