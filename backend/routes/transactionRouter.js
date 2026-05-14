import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  addExpense,
  getExpense,
  addIncome,
  getIncome,
} from "../controllers/transactionController.js";

export const transactionRouter = express.Router();
transactionRouter.get("/expenses", requireAuth, getExpense);
transactionRouter.get("/income", requireAuth, getIncome);
transactionRouter.post("/addIncome", requireAuth, addIncome);
transactionRouter.post("/addExpense", requireAuth, addExpense);
// transactionRouter.patch("/updateExpense/:id", requireAuth, handler);
// incomeRouter.patch("/updateIncome/:id", requireAuth, handler);
