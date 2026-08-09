import express from "express";
import { handleAIRequest, getProvidersController } from "../controllers/ai.controller.js";

const router = express.Router();

router.get("/providers", getProvidersController);
router.post("/", handleAIRequest);

export default router;