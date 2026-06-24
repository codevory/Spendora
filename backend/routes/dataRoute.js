import express from "express";
import {
  addNewCategory,
  deleteCategory,
  getCategories,
  renameCategory,
} from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const dataRoute = express.Router();
dataRoute.get("/categories", requireAuth, getCategories);
dataRoute.post("/addNewCategory", requireAuth, addNewCategory);
dataRoute.post("/renameCategory", requireAuth, renameCategory);
dataRoute.delete("/deleteCategory", requireAuth, deleteCategory);
