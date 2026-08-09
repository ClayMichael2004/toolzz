import { generateAIResponse as generateAIResponseFromManager, getAvailableProviders } from "./ai/aiManager.js";

export const generateAIResponse = async (prompt, options = {}) => {
  return generateAIResponseFromManager(prompt, options);
};

export { getAvailableProviders };
