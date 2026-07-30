import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addExpense,
  getExpense,
} from "../controllers/transactionController.ts";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";
import { csrfProtection } from "../middleware/csrfProtection.js";

export const expenseRoute = express.Router();
expenseRoute.get("/", requireAuth, getDataRateLimiter, getExpense);
expenseRoute.post(
  "/",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  addExpense,
);
// transactionRouter.patch("/updateExpense/:id", requireAuth, handler);
// incomeRouter.patch("/updateIncome/:id", requireAuth, handler);
