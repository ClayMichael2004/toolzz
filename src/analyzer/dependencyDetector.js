export const detectDependencies = (dependencies = []) => {

    const report = {
        frontend: [],
        backend: [],
        database: [],
        authentication: [],
        testing: [],
        buildTools: [],
        utilities: []
    };

    const categories = {

        frontend: [
            "react",
            "react-dom",
            "react-router-dom",
            "next",
            "vue",
            "@angular/core"
        ],

        backend: [
            "express",
            "koa",
            "fastify",
            "@nestjs/core"
        ],

        database: [
            "pg",
            "mongoose",
            "mysql2",
            "sqlite3",
            "prisma"
        ],

        authentication: [
            "jsonwebtoken",
            "passport",
            "bcrypt",
            "bcryptjs"
        ],

        testing: [
            "jest",
            "vitest",
            "supertest",
            "@testing-library/react"
        ],

        buildTools: [
            "vite",
            "webpack",
            "parcel"
        ],

        utilities: [
            "dotenv",
            "axios",
            "cors",
            "helmet",
            "multer",
            "zod",
            "joi",
            "morgan"
        ]

    };

    for (const dependency of dependencies) {

        for (const category in categories) {

            if (categories[category].includes(dependency)) {

                report[category].push(dependency);

            }

        }

    }

    return report;

};

