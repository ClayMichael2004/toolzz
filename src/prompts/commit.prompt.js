export const commitPrompt= (input) =>`
You are a senior software engineer.
Generate a clean Git message using convectional commits.
Rules: 
-Be short and professional
-Use correct typoe (feat, fix, docs, refactor)

Changes: ${input}
`;