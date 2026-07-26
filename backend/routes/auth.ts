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
import { csrfProtection } from "../middleware/csrfProtection.js";


export const authRouter = express.Router();
authRouter.post("/login", loginRateLimiter, loginUser);
authRouter.post("/register", registerRateLimiter, registerUser);
authRouter.get("/logout",requireAuth, getDataRateLimiter, logoutUser);
authRouter.get("/sid",(req,res) => {
  res.status(200).json({sid: req.sessionID})
})

authRouter.use(csrfProtection)
authRouter.get("/csrf", (req, res) => {
  const csrfToken = res.locals._csrf

  req.session.save((err) => {
    if(err){
      return res.status(500).json({error:"Internal server error to save session"})
    }
    res.status(200).json({ csrf: csrfToken});
  })
});