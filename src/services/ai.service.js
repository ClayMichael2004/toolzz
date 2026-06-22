import { GoogleGenAI } from "@google/genai";

export const generateAIResponse = async(prompt)=>{
    try{
        const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

        const response=await
        client.chat.completions.create({
        model: "gemini-2.5-flash",
        content: prompt,
    });

    return response.text;
    } catch (error){
        console.error("Gemini error:", error);
        throw new Error("Failed to generate AI response"); 
    }
};