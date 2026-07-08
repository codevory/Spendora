import { rateLimit } from "express-rate-limit";
import { is_Production } from "../db/getBDConnection.js";

interface addRateLimiterProps {
  windowMinutes:number,
  limit:number,
  message:{error:string},
  is_production:boolean
}

export function addRateLimiter({
  windowMinutes,
  limit,
  message,
  is_production,
}:addRateLimiterProps) {
  if(!is_production){
    return rateLimit({
      windowMs:1 * 60 * 1000,
      limit:500,
      message:message
    })
  }
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: limit,
    message:message
  });
}

export const loginRateLimiter = addRateLimiter({
  windowMinutes: 10,
  limit: 5,
  message:{error:"Too many login attempts. Try again in 10 minutes.."},
  is_production:is_Production
});

export const registerRateLimiter = addRateLimiter({
  windowMinutes:10,
  limit:10,
  message:{error:"Too many sign up attempts. Try again in 10 minutes.."},
  is_production:is_Production
})

export const getDataRateLimiter = addRateLimiter({
  windowMinutes: 1,
  limit: 35,
  message:{error: "Too many requests. Please wait a minute before trying again."},
  is_production:is_Production
});

export const postDataRateLimiter = addRateLimiter({
  windowMinutes: 0.5,
  limit: 10,
  message:{error: "You are submitting data too quickly. Please wait 30 seconds."},
  is_production:is_Production
});

