import express from "express";
import multer from "multer";
import { extractUploadedProject } from "../middleware/extractProject.middleware.js";
import { generateReadmeController } from "../controllers/readme.controller.js";

const router = express.Router();

const upload = multer({
    dest: "src/uploads/"
});

router.post(
    "/generate",
    upload.single("project"),
    extractUploadedProject,
    generateReadmeController
);

export default router