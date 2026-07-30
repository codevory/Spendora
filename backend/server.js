import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import pgSession from "connect-pg-simple";
import {
  environment,
  getDBConnection,
  is_Production,
} from "./db/getBDConnection.js";
import { meRouter } from "./routes/meRouter.js";
import { authRouter } from "./routes/auth.js";
import path from "node:path";
import { transactionRoute } from "./routes/transactionRoute.js";
import { categoryRoute } from "./routes/categoryRoute.js";
import { fileURLToPath } from "node:url";
import { serverHealthRoute } from "./routes/serverHealthRoute.js";
import { csrfProtection } from "./middleware/csrfProtection.js";
import cookieParser from "cookie-parser";
import { expenseRoute } from "./routes/expenseRoute.js";
import { incomeRoute } from "./routes/incomeRoute.js";
import { getDataRateLimiter } from "./helpers/rateLimiters.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `.env.${environment}` });
const secret = process.env.SPIRAL_SESSION_SECRET;

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 2122;
const PostgresStore = pgSession(session);
const dbPool = await getDBConnection();
// 2. CORS MIDDLEWARE
const allowed_origins_prod = ["https://spendora-khaki.vercel.app"];
const allowed_origins_dev = [
  "http://localhost:5173",
  "http://localhost:2122",
  "http://localhost:3000",
];

const allowed_origns = is_Production
  ? allowed_origins_prod
  : allowed_origins_dev;

app.use(
  cors({
    origin: (origins, callback) => {
      if (allowed_origns.includes(origins)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "x-csrf-token",
    ],
    exposedHeaders: ["X-CSRF-Token", "x-csrf-token"],
  }),
);

// 3. BODY PARSERS
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new PostgresStore({
      pool: dbPool,
      tableName: "sessions",
    }),
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: is_Production,
      sameSite: is_Production ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api/v1/auth/me", meRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/transaction", transactionRoute);
app.use("/api/v1/transaction/expenses", expenseRoute);
app.use("/api/v1/transaction/incomes", incomeRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/status", serverHealthRoute);

app.listen(PORT, () => {
  try {
    console.log(`app live at Base_URL:${PORT}`);
  } catch (err) {
    console.error("Error listening to port ", err.message);
  }
});
