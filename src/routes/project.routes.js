import express from "express";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
    "/upload",
    upload.single("project"),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No ZIP uploaded."
            });
        }

        res.json({
            success: true,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size
        });

    }
);

export default router;