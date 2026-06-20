import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

export const generateAIResponse = async(prompt)=>{
    const response=await
    client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    return response.choices[0].message.content;
};