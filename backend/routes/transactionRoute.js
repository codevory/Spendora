import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addExpense,
  addIncome,
  getIncome,
  getRecentTransactions,
  getExpense,
} from "../controllers/transactionController.ts";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";
import { csrfProtection } from "../middleware/csrfProtection.js";

export const transactionRoute = express.Router();
transactionRoute.get(
  "/transactions",
  requireAuth,
  getDataRateLimiter,
  getRecentTransactions,
);

transactionRoute.get("/expenses", requireAuth, getDataRateLimiter, getExpense);
transactionRoute.get("/incomes", requireAuth, getDataRateLimiter, getIncome);
transactionRoute.post(
  "/addIncome",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  addIncome,
);
transactionRoute.post(
  "/addExpense",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  addExpense,
);
// transactionRouter.patch("/updateExpense/:id", requireAuth, handler);
// incomeRouter.patch("/updateIncome/:id", requireAuth, handler);
