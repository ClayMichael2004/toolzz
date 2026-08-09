import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getSelectedAgent = () => {
    return localStorage.getItem("toolzz_selected_agent") || "auto";
};

export const setSelectedAgent = (agentId) => {
    localStorage.setItem("toolzz_selected_agent", agentId);
    window.dispatchEvent(new Event("toolzz_agent_changed"));
};

export const fetchAIProviders = async () => {
    try {
        const response = await api.get("/ai/providers");
        return response.data.data;
    } catch (err) {
        console.warn("Failed to fetch AI providers from backend:", err.message);
        return [];
    }
};

export const generateAI = async (tool, input, providerOverride) => {
    const provider = providerOverride || getSelectedAgent();
    const response = await api.post("/ai", {
        tool,
        input,
        provider,
    });
    return response.data.data.result;
};

export default api;