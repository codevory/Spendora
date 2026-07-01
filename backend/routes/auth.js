import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController.js";
import { rateLimit } from "express-rate-limit";

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message: { error: "Too many login attempts. Try again in 10 minutes.." },
});

export const authRouter = express.Router();
authRouter.post("/login", loginRateLimiter, loginUser);
authRouter.post("/register", registerUser);
authRouter.get("/logout", logoutUser);
