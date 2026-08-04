import fs from "fs/promises";
import { generateReadme } from "../services/readme.service.js";
import { analyzeProject } from "../services/projectAnalysis.service.js";

export const generateReadmeController = async (req, res, next) => {
    try {
        if (!req.projectPath) {
            return res.status(400).json({
                success: false,
                message: "No uploaded project found."
            });
        }
        const report = await analyzeProject(req.projectPath);
        const readme = await generateReadme(report);

        res.json({
            success: true,
            report,
            readme
        });
    } catch (error) {
        next(error);
    } finally {
        if (req.file?.path) {
            await fs.rm(req.file.path, { force: true }).catch(() => {});
        }
        if (req.projectPath) {
            await fs.rm(req.projectPath, { recursive: true, force: true }).catch(() => {});
        }
    }
};
