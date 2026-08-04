export const detectFrameworks = (dependencies = [], scanResult = {}) => {
  const deps = dependencies.map(d => d.toLowerCase());
  const has = (name) => deps.some(d => d === name || d.includes(name));
  const fileNames = (scanResult.importantFiles || []).map(f => f.name.toLowerCase());
  const hasFile = (name) => fileNames.includes(name.toLowerCase());

  const result = {
    frontend: "Not detected",
    backend: "Not detected",
    database: "Not detected",
    authentication: "Not detected",
    buildTool: "Not detected",
    testing: "Not detected"
  };

  // ---------- Frontend ----------
  if (has("next")) result.frontend = "Next.js";
  else if (has("nuxt")) result.frontend = "Nuxt.js";
  else if (has("remix")) result.frontend = "Remix";
  else if (has("sveltekit") || has("@sveltejs/kit")) result.frontend = "SvelteKit";
  else if (has("svelte")) result.frontend = "Svelte";
  else if (has("astro")) result.frontend = "Astro";
  else if (has("solid-js")) result.frontend = "SolidJS";
  else if (has("preact")) result.frontend = "Preact";
  else if (has("react")) result.frontend = "React";
  else if (has("vue")) result.frontend = "Vue.js";
  else if (has("@angular/core") || has("angular")) result.frontend = "Angular";
  else if (has("alpinejs")) result.frontend = "Alpine.js";

  // ---------- Backend ----------
  if (has("express")) result.backend = "Express.js";
  else if (has("@nestjs/core") || has("nestjs")) result.backend = "NestJS";
  else if (has("fastify")) result.backend = "Fastify";
  else if (has("koa")) result.backend = "Koa";
  else if (has("fastapi")) result.backend = "FastAPI";
  else if (has("django")) result.backend = "Django";
  else if (has("flask")) result.backend = "Flask";
  else if (has("gin-gonic") || has("gin")) result.backend = "Gin (Go)";
  else if (has("fiber")) result.backend = "Fiber (Go)";
  else if (has("actix-web")) result.backend = "Actix-Web (Rust)";
  else if (has("spring-boot") || has("springframework")) result.backend = "Spring Boot (Java)";
  else if (has("laravel")) result.backend = "Laravel (PHP)";
  else if (has("rails")) result.backend = "Ruby on Rails";

  // ---------- Database ----------
  if (has("prisma") || has("@prisma/client")) result.database = "Prisma ORM";
  else if (has("mongoose")) result.database = "MongoDB (Mongoose)";
  else if (has("mongodb")) result.database = "MongoDB";
  else if (has("typeorm")) result.database = "TypeORM";
  else if (has("sequelize")) result.database = "Sequelize";
  else if (has("drizzle-orm")) result.database = "Drizzle ORM";
  else if (has("pg") || has("postgres")) result.database = "PostgreSQL";
  else if (has("mysql2") || has("mysql")) result.database = "MySQL";
  else if (has("sqlite3") || has("better-sqlite3") || has("sqlite")) result.database = "SQLite";
  else if (has("sqlalchemy")) result.database = "SQLAlchemy (Python)";
  else if (has("redis") || has("ioredis")) result.database = "Redis";
  else if (has("supabase")) result.database = "Supabase";
  else if (has("firebase")) result.database = "Firebase";

  // ---------- Authentication ----------
  if (has("jsonwebtoken") || has("jwt") || has("pyjwt")) result.authentication = "JWT";
  else if (has("next-auth") || has("@auth/core")) result.authentication = "NextAuth / Auth.js";
  else if (has("passport")) result.authentication = "Passport.js";
  else if (has("bcrypt") || has("bcryptjs") || has("argon2")) result.authentication = "Bcrypt / Hashing";
  else if (has("@clerk/clerk-sdk-node") || has("@clerk/nextjs")) result.authentication = "Clerk";
  else if (has("firebase-admin")) result.authentication = "Firebase Auth";

  // ---------- Build Tools ----------
  if (has("vite") || hasFile("vite.config.js") || hasFile("vite.config.ts")) result.buildTool = "Vite";
  else if (has("next") || hasFile("next.config.js")) result.buildTool = "Next.js Compiler (SWC/Turbopack)";
  else if (has("webpack") || hasFile("webpack.config.js")) result.buildTool = "Webpack";
  else if (has("turbopack") || has("turbo")) result.buildTool = "Turborepo / Turbopack";
  else if (has("rollup")) result.buildTool = "Rollup";
  else if (has("esbuild")) result.buildTool = "Esbuild";
  else if (has("parcel")) result.buildTool = "Parcel";

  // ---------- Testing ----------
  if (has("vitest")) result.testing = "Vitest";
  else if (has("jest")) result.testing = "Jest";
  else if (has("pytest")) result.testing = "Pytest";
  else if (has("cypress")) result.testing = "Cypress";
  else if (has("playwright") || has("@playwright/test")) result.testing = "Playwright";
  else if (has("mocha")) result.testing = "Mocha";

  return result;
};