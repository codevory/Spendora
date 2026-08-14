import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { addIncome, getIncome } from "../controllers/transactionController.ts";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";
import { csrfProtection } from "../middleware/csrfProtection.js";
import { sanitizeInput } from "../middleware/inputSanitizer.js";

export const incomeRoute = express.Router();
incomeRoute.get("/", requireAuth, getDataRateLimiter, getIncome);
incomeRoute.post(
  "/",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  sanitizeInput(["incomeData.entity"]),
  addIncome,
);
