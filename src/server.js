import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import aiRoutes from "./routes/ai.routes.js";
import errorHandler from "./middleware/error.middleware.js";
import projectRoutes from "./routes/project.routes.js";
import readmeRoutes from "./routes/readme.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/readme", readmeRoutes);

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Toolzz AI API is running" });
});

// Serve frontend dist assets if present (for Render single-service deployment)
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.json({ message: "Toolzz AI API is running" });
    });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SERVER running on port ${PORT}`);
});