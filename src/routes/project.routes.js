import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadProject } from "../controllers/project.controller.js";

const router = express.Router();

router.post(
    "/upload",
    upload.single("project"),
    uploadProject
);

export default router;