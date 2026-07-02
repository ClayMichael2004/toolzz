import express from "express";
import multer from "multer";
import { extractProject } from "../analyzer/zipExtractor.js";
import { generateReadmeController } from "../controllers/readme.controller.js";

const router = express.Router();

const upload = multer({
    dest: "src/uploads/"
});

router.post(
    "/generate",
    upload.single("project"),
    extractProject,
    generateReadmeController
);

export default router