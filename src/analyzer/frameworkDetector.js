export const detectFrameworks = (dependencies = []) => {

    const result = {
        frontend: "Unknown",
        backend: "Unknown",
        database: "Unknown",
        authentication: "Unknown",
        buildTool: "Unknown",
        testing: "Unknown"
    };

    // ---------- Frontend ----------
    if (dependencies.includes("react"))
        result.frontend = "React";

    if (dependencies.includes("next"))
        result.frontend = "Next.js";

    if (dependencies.includes("vue"))
        result.frontend = "Vue";

    if (dependencies.includes("@angular/core"))
        result.frontend = "Angular";

    // ---------- Backend ----------
    if (dependencies.includes("express"))
        result.backend = "Express";

    if (dependencies.includes("@nestjs/core"))
        result.backend = "NestJS";

    if (dependencies.includes("fastify"))
        result.backend = "Fastify";

    if (dependencies.includes("koa"))
        result.backend = "Koa";

    // ---------- Database ----------
    if (dependencies.includes("pg"))
        result.database = "PostgreSQL";

    if (dependencies.includes("mongoose"))
        result.database = "MongoDB";

    if (dependencies.includes("mysql2"))
        result.database = "MySQL";

    if (dependencies.includes("sqlite3"))
        result.database = "SQLite";

    // ---------- Authentication ----------
    if (dependencies.includes("jsonwebtoken"))
        result.authentication = "JWT";

    if (dependencies.includes("passport"))
        result.authentication = "Passport";

    // ---------- Build Tools ----------
    if (dependencies.includes("vite"))
        result.buildTool = "Vite";

    if (dependencies.includes("webpack"))
        result.buildTool = "Webpack";

    // ---------- Testing ----------
    if (dependencies.includes("jest"))
        result.testing = "Jest";

    if (dependencies.includes("vitest"))
        result.testing = "Vitest";

    return result;
};