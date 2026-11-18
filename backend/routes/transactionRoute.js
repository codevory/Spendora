import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  getRecentTransactions,
  getUserFinancialSummary,
  handleDeleteTransactions
} from "../controllers/transactionController.ts";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";
import { csrfProtection } from "../middleware/csrfProtection.js";

export const transactionRoute = express.Router();
transactionRoute.get(
  "/",
  requireAuth,
  getDataRateLimiter,
  getRecentTransactions,
);

transactionRoute.get(
  "/financial-summary",
  requireAuth,
  getDataRateLimiter,
  getUserFinancialSummary,
);

transactionRoute.delete(
  "/delete/:transactions",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  handleDeleteTransactions,
);
