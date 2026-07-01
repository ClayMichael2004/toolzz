import express from "express";
import upload from "../middleware/upload.middleware.js";
import { extractProject } from "../analyzer/zipExtractor.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("project"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No ZIP uploaded.",
        });
      }

      const extractedPath = await extractProject(
        req.file.path,
        "src/temp"
      );

      res.json({
        success: true,
        upload: req.file.filename,
        extractedTo: extractedPath,
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;