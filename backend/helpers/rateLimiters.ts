import { rateLimit } from "express-rate-limit";

interface addRateLimiterProps {
  windowMinutes:number,
  limit:number,
  message:{error:string},
}

export function addRateLimiter({
  windowMinutes,
  limit,
  message,
}:addRateLimiterProps) {
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
});

export const registerRateLimiter = addRateLimiter({
  windowMinutes:10,
  limit:10,
  message:{error:"Too many sign up attempts. Try again in 10 minutes.."}
})

export const getDataRateLimiter = addRateLimiter({
  windowMinutes: 1,
  limit: 35,
  message:{error: "Too many requests. Please wait a minute before trying again."},
});

export const postDataRateLimiter = addRateLimiter({
  windowMinutes: 0.5,
  limit: 10,
  message:{error: "You are submitting data too quickly. Please wait 30 seconds."},
});

