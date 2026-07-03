import express from "express";
import { getDataRateLimiter } from "../helpers/rateLimiters.ts";
import { getServerHealth } from "../controllers/serverHealthController..js";

export const serverHealthRoute = express.Router();

serverHealthRoute.get("/serverHealth", getDataRateLimiter, getServerHealth);
