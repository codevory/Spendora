import express from "express";
import { getCurrentUser } from "../controllers/meController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { getDataRateLimiter } from "../helpers/rateLimiters.ts";

export const meRouter = express.Router();
meRouter.get("/", requireAuth, getDataRateLimiter, getCurrentUser);
