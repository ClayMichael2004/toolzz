import axios from "axios";
import { buildReadmePrompt } from "./readmePromptBuilder.js";

export const generateReadme = async (report) => {

    try {

        const prompt = buildReadmePrompt(report);

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            }
        );

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {

        console.error(
            "README Generation Error:",
            error.response?.data || error.message
        );

        throw new Error("Failed to generate README.");

    }

};