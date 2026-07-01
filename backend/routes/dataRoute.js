import express from "express";
import {
  addNewCategory,
  deleteCategory,
  getCategories,
  renameCategory,
} from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { postDataRateLimiter } from "../helpers/rateLimiters.js";

export const dataRoute = express.Router();
dataRoute.get("/categories", requireAuth, getDataRateLimiter, getCategories);
dataRoute.post(
  "/addNewCategory",
  requireAuth,
  postDataRateLimiter,
  addNewCategory,
);
dataRoute.post(
  "/renameCategory",
  requireAuth,
  postDataRateLimiter,
  renameCategory,
);
dataRoute.delete("/deleteCategory", requireAuth, deleteCategory);
