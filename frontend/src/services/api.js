import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const generateAI=async(tool, input)=>{
    const response=await api.post("/ai", {
        tool,
        input,
    });
    return response.data.data.result;
};

export default api;