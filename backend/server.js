import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { getDBConnection } from "./db/getBDConnection.js";
import { meRouter } from "./routes/meRouter.js";
import { authRouter } from "./routes/auth.js";
import path from "node:path";
import { transactionRouter } from "./routes/transactionRouter.js";
import { dataRoute } from "./routes/dataRoute.js";

dotenv.config();
const secret = process.env.SPIRAL_SESSION_SECRET;
const app = express();
const PORT = 2122;

//initialize the postgres store constructor
const PostgresStore = pgSession(session);
const dbPool = await getDBConnection();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:2122"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(
  session({
    store: new PostgresStore({
      pool: dbPool,
      tableName: "session",
    }),
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }),
);
const publicFolder = path.join("../frontend/dist");
app.use(express.static("public"));
app.use("/api/auth/me", meRouter);
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/data", dataRoute);
app.listen(PORT, () => {
  try {
    console.log(`listening at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Error listening to port ", err.message);
  }
});
