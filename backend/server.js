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
import { dataRoute } from "./routes/dataRoute.js";
import { fileURLToPath } from "node:url";
import { serverHealthRoute } from "./routes/serverHealthRoute.js";
import { csrfProtection } from "./middleware/csrfProtection.js";
import cookieParser from "cookie-parser";

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
const allowedOriginsProd = ["https://spendora-khaki.vercel.app"];
const allowedOriginsDev = [
  "http://localhost:5173",
  "http://localhost:2122",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (is_Production && allowedOriginsProd.includes(origin)) {
        callback(null, true);
      } else if (!is_Production && allowedOriginsDev.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
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

// 4. SESSION MIDDLEWARE (Must come before CSRF protection)
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

app.use("/api/auth/me", meRouter);
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRoute);
app.use("/api/data", dataRoute);
app.use("/api/status", serverHealthRoute);

app.listen(PORT, () => {
  try {
    console.log(`app live at Base_URL:${PORT}`);
  } catch (err) {
    console.error("Error listening to port ", err.message);
  }
});
