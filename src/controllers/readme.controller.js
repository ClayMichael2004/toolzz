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
    }
};
