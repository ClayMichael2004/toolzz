export const detectFrameworks = (dependencies = []) => {

    const hasPackage = (name) =>
        dependencies.some((dependency) =>
            dependency === name || dependency.startsWith(`${name}/`) || dependency.includes(name)
        );

    const result = {
        frontend: "Unknown",
        backend: "Unknown",
        database: "Unknown",
        authentication: "Unknown",
        buildTool: "Unknown",
        testing: "Unknown"
    };

    // ---------- Frontend ----------
    if (hasPackage("next"))
        result.frontend = "Next.js";

    if (hasPackage("remix"))
        result.frontend = "Remix";

    if (hasPackage("svelte"))
        result.frontend = "Svelte";

    if (hasPackage("solid-js") || hasPackage("solid-start"))
        result.frontend = "Solid";

    if (hasPackage("preact"))
        result.frontend = "Preact";

    if (hasPackage("react"))
        result.frontend = "React";

    if (hasPackage("vue"))
        result.frontend = "Vue";

    if (hasPackage("@angular/core") || hasPackage("angular"))
        result.frontend = "Angular";

    // ---------- Backend ----------
    if (hasPackage("@nestjs/core") || hasPackage("nestjs"))
        result.backend = "NestJS";

    if (hasPackage("express"))
        result.backend = "Express";

    if (hasPackage("fastify"))
        result.backend = "Fastify";

    if (hasPackage("koa"))
        result.backend = "Koa";

    if (hasPackage("@hapi/hapi") || hasPackage("hapi"))
        result.backend = "Hapi";

    if (hasPackage("serverless-http"))
        result.backend = "Serverless";

    // ---------- Database ----------
    if (hasPackage("pg") || hasPackage("postgres"))
        result.database = "PostgreSQL";

    if (hasPackage("mongoose") || hasPackage("mongodb"))
        result.database = "MongoDB";

    if (hasPackage("mysql2") || hasPackage("mysql"))
        result.database = "MySQL";

    if (hasPackage("sqlite3") || hasPackage("better-sqlite3") || hasPackage("sqlite"))
        result.database = "SQLite";

    if (hasPackage("@prisma/client"))
        result.database = "Prisma";

    // ---------- Authentication ----------
    if (hasPackage("jsonwebtoken"))
        result.authentication = "JWT";

    if (hasPackage("passport") || hasPackage("passport-local") || hasPackage("passport-jwt"))
        result.authentication = "Passport";

    if (hasPackage("bcrypt") || hasPackage("bcryptjs"))
        result.authentication = "Bcrypt";

    // ---------- Build Tools ----------
    if (hasPackage("vite"))
        result.buildTool = "Vite";

    if (hasPackage("webpack"))
        result.buildTool = "Webpack";

    if (hasPackage("rollup"))
        result.buildTool = "Rollup";

    if (hasPackage("parcel"))
        result.buildTool = "Parcel";

    // ---------- Testing ----------
    if (hasPackage("vitest"))
        result.testing = "Vitest";

    if (hasPackage("jest"))
        result.testing = "Jest";

    if (hasPackage("mocha"))
        result.testing = "Mocha";

    if (hasPackage("cypress"))
        result.testing = "Cypress";

    if (hasPackage("playwright"))
        result.testing = "Playwright";

    return result;
};