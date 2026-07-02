import { GoogleGenAI } from "@google/genai";
import { buildReadmePrompt } from "./readmePromptBuilder.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const generateReadme = async (report) => {

    try {

        const prompt = buildReadmePrompt(report);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;

    } catch (error) {

        console.error("README Generation Error:", error);

        throw new Error("Failed to generate README.");

    }

};
