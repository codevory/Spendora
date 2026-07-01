import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import {
  loginRateLimiter,
  registerRateLimiter,
} from "../helpers/rateLimiters.ts";


  
export const authRouter = express.Router();
authRouter.post("/login", loginRateLimiter, loginUser);
authRouter.post("/register", registerRateLimiter, registerUser);
authRouter.get("/logout", logoutUser);
