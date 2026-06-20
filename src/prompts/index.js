import { commitPrompt } from "./commit.prompt";
import { errorPrompt } from "./error.prompt";
import { readmePrompt } from "./readme.prompt";

export const buildPrompt = (tool, input)=>{
    switch (tool){
        case "commit":
            return commitPrompt(input);

        case "error":
            return errorPrompt(input);

        case "readme":
            return readmePrompt(input);

        default:
            return "invalid tool selected";
    }
};