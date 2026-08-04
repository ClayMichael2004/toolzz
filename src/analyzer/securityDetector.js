export const detectSecurity = (dependencies = [], importantFiles = []) => {
  const deps = dependencies.map(d => d.toLowerCase());
  const fileNames = importantFiles.map(f => f.name.toLowerCase());

  const hasDep = (name) => deps.some(d => d === name || d.includes(name));
  const hasFile = (name) => fileNames.some(f => f === name.toLowerCase());

  const report = {
    helmet: hasDep("helmet"),
    cors: hasDep("cors"),
    jwt: hasDep("jwt") || hasDep("jsonwebtoken") || hasDep("pyjwt"),
    bcrypt: hasDep("bcrypt") || hasDep("bcryptjs") || hasDep("argon2") || hasDep("passlib"),
    dotenv: hasDep("dotenv") || hasDep("python-dotenv"),
    envExample: hasFile(".env.example") || hasFile(".env.template"),
    gitignore: hasFile(".gitignore"),
    rateLimit: hasDep("express-rate-limit") || hasDep("rate-limit") || hasDep("slow-down"),
    validation: hasDep("zod") || hasDep("joi") || hasDep("express-validator") || hasDep("validator") || hasDep("pydantic")
  };

  const activeCount = Object.values(report).filter(v => v === true).length;
  report.score = Math.min(100, Math.round((activeCount / Object.keys(report).length) * 100));

  return report;
};