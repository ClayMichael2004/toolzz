import { commitPrompt } from "./commit.prompt.js";
import { errorPrompt } from "./error.prompt.js";
import { readmePrompt } from "./readme.prompt.js";
import { scaffoldPrompt } from "./scaffold.prompt.js";

export const buildPrompt = (tool, input) => {
    switch (tool) {
        case "commit":
            return commitPrompt(input);

        case "error":
            return errorPrompt(input);

        case "readme":
            return readmePrompt(input);

        case "scaffold":
        case "structure":
            return scaffoldPrompt(input);

        default:
            return "invalid tool selected";
    }
};