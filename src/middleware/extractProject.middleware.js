import { extractProject } from "../analyzer/zipExtractor.js";

export const extractUploadedProject = async (req, res, next) => {
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

        req.projectPath = extractedPath;

        next();

    } catch (error) {
        next(error);
    }
};

