import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addExpense,
  getExpense,
  addIncome,
  getIncome,
  getTransactions,
} from "../controllers/transactionController.ts";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";

export const transactionRoute = express.Router();
transactionRoute.get(
  "/transactions",
  requireAuth,
  getDataRateLimiter,
  getTransactions,
);
transactionRoute.get("/expenses", requireAuth, getDataRateLimiter, getExpense);
transactionRoute.get("/income", requireAuth, getDataRateLimiter, getIncome);
transactionRoute.post(
  "/addIncome",
  requireAuth,
  postDataRateLimiter,
  addIncome,
);
transactionRoute.post(
  "/addExpense",
  requireAuth,
  postDataRateLimiter,
  addExpense,
);
// transactionRouter.patch("/updateExpense/:id", requireAuth, handler);
// incomeRouter.patch("/updateIncome/:id", requireAuth, handler);
