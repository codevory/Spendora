import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import {
  getDataRateLimiter,
  loginRateLimiter,
  registerRateLimiter,
} from "../helpers/rateLimiters.ts";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = express.Router();
authRouter.post("/login", loginRateLimiter, loginUser);
authRouter.post("/register", registerRateLimiter, registerUser);
authRouter.get("/logout",requireAuth, getDataRateLimiter, logoutUser);
