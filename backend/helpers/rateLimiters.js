import { rateLimit } from "express-rate-limit";

export const getDataRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 35,
  message: {
    error: "Too many requests. Please wait a minute before trying again.",
  },
});

export const postDataRateLimiter = rateLimit({
  windowMs: 30 * 1000,
  limit: 10,
  message: {
    error: "You are submitting data too quickly. Please wait 30 seconds.",
  },
});
