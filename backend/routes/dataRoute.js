import { requireAuth } from "../middleware/requireAuth.js";
import { csrfProtection } from "../middleware/csrfProtection.js";
import express from "express";

import {
  addNewCategory,
  deleteCategory,
  getCategories,
  renameCategory,
} from "../controllers/categoryController.js";

import {
  getDataRateLimiter,
  postDataRateLimiter,
} from "../helpers/rateLimiters.ts";

export const dataRoute = express.Router();
dataRoute.get("/categories", requireAuth, getDataRateLimiter, getCategories);
dataRoute.post(
  "/addNewCategory",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  addNewCategory,
);
dataRoute.post(
  "/renameCategory",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  renameCategory,
);
dataRoute.delete(
  "/deleteCategory",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  deleteCategory,
);
