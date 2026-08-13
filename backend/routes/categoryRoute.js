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
import { sanitizeInputFields } from "../middleware/sanitizeInput.js";

export const categoryRoute = express.Router();
categoryRoute.get("/", requireAuth, getDataRateLimiter, getCategories);
categoryRoute.post(
  "/",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  sanitizeInputFields(["name"]),
  addNewCategory,
);
categoryRoute.patch(
  "/:id",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  sanitizeInputFields(["name"]),
  renameCategory,
);
categoryRoute.delete(
  "/:id",
  requireAuth,
  csrfProtection,
  postDataRateLimiter,
  deleteCategory,
);
