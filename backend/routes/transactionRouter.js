import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addExpense,
  getExpense,
  addIncome,
  getIncome,
} from "../controllers/transactionController.js";
import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.js";

export const transactionRouter = express.Router();
transactionRouter.get("/expenses", requireAuth, getDataRateLimiter, getExpense);
transactionRouter.get("/income", requireAuth, getDataRateLimiter, getIncome);
transactionRouter.post(
  "/addIncome",
  requireAuth,
  postDataRateLimiter,
  addIncome,
);
transactionRouter.post(
  "/addExpense",
  requireAuth,
  postDataRateLimiter,
  addExpense,
);
// transactionRouter.patch("/updateExpense/:id", requireAuth, handler);
// incomeRouter.patch("/updateIncome/:id", requireAuth, handler);
