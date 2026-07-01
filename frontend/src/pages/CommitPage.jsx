import { useState } from "react";
import ToolInput from "../components/ToolInput.jsx";
import ToolOutput from "../components/ToolOutput.jsx";
import api from "../services/api.js"

const CommitPage=()=>{
    const [output, setOutput]= useState("");
    const [loading, setLoading]= useState(false);

    const handleGenerate=async (input)=>{
        try{
            setLoading(true);

            const response=await api.post("/ai", {tool: "commit", input,});

            setOutput(response.data.data.result);
        }catch(error){
            console.log(error);
            
            setOutput("failed to generate commit message");
        } finally{
            setLoading(false);
        }
    };

    return(
        <>
        <ToolInput title="Commit Message Generator" placeholder="Describe the code changes you made" loading={loading} onGenerate={handleGenerate}/>
        <ToolOutput output={output}/>
        </>
    );
};
export default CommitPage;