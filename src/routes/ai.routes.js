import express from "express";
import { handleAIRequest } from "../controllers/ai.controller";

const router=express.Router();

router.post("/", handleAIRequest)

export default router;