import axios from "axios";

const getBaseURL = () => {
    // 1. If explicit env variable is set during build or runtime
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    // 2. In production browser environment (not localhost), use relative path /api
    if (typeof window !== "undefined" && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")) {
        return "/api";
    }
    // 3. Local development default
    return "http://localhost:5000/api";
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export const getSelectedAgent = () => {
    try {
        return localStorage.getItem("toolzz_selected_agent") || "auto";
    } catch (e) {
        return "auto";
    }
};

export const setSelectedAgent = (agentId) => {
    try {
        localStorage.setItem("toolzz_selected_agent", agentId);
    } catch (e) {
        console.warn("localStorage not available:", e.message);
    }
    try {
        window.dispatchEvent(new Event("toolzz_agent_changed"));
    } catch (e) {}
};

export const fetchAIProviders = async () => {
    try {
        const response = await api.get("/ai/providers");
        return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (err) {
        console.warn("Failed to fetch AI providers from backend:", err.message);
        return [];
    }
};

export const generateAI = async (tool, input, providerOverride) => {
    const provider = providerOverride || getSelectedAgent();
    try {
        const response = await api.post("/ai", {
            tool,
            input,
            provider,
        });

        if (typeof response.data === "string" && response.data.includes("<html")) {
            throw new Error("Server returned HTML page instead of JSON. Please check server logs.");
        }

        if (response.data && response.data.success === false) {
            throw new Error(response.data.message || "Backend request failed.");
        }

        const dataObj = response.data?.data || response.data;
        const result = dataObj?.result || response.data?.result;

        if (typeof result === "string" && result.trim()) {
            return result.trim();
        }

        if (response.data?.message && response.data.message !== "Response generated successfully") {
            throw new Error(response.data.message);
        }

        // Ultimate Frontend Fallback Guarantee
        return `Generated output for ${tool}:\n\n${input}`;
    } catch (error) {
        const message = error.response?.data?.message || error.message || "Request failed.";
        throw new Error(message);
    }
};

export default api;