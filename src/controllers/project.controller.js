import fs from "fs/promises";
import { extractProject } from "../analyzer/zipExtractor.js";
import { analyzeProject } from "../services/projectAnalysis.service.js";

export const uploadProject = async (req, res, next) => {
    let extractedPath = null;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No ZIP uploaded."
            });
        }

        extractedPath = await extractProject(
            req.file.path,
            "src/temp"
        );

        const analysis = await analyzeProject(extractedPath);

        return res.status(200).json({
            success: true,
            analysis
        });
    } catch (error) {
        next(error);
    } finally {
        if (req.file?.path) {
            await fs.rm(req.file.path, { force: true }).catch(() => {});
        }
        if (extractedPath) {
            await fs.rm(extractedPath, { recursive: true, force: true }).catch(() => {});
        }
    }
};