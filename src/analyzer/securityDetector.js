export const detectSecurity=(
    dependencies= [],
    importantFiles= []
)=>{
    const hasDependency=(name)=>dependencies.includes(name);
    const hasFile =(name)=>importantFiles.some(file=>file.name ===name);

    return {
        helmet: hasDependency("helmet"),
        cors: hasDependency("cors"),
        jwt: hasDependency("jwt") || hasDependency("jsonwebtoken"),
        bcrypt: hasDependency("bcrypt") || hasDependency("bcryptjs"),
        dotenv: hasDependency("dotenv"),
        envExample: hasFile(".env.example")
    };
};