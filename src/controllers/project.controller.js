import { extractProject } from "../analyzer/zipExtractor.js";
import { analyzeProject } from "../services/projectAnalysis.service.js";

export const uploadProject = async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No ZIP uploaded."
            });
        }

        const extractedPath = await extractProject(
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
    }
};