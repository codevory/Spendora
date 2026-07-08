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
import { authRouter } from "./routes/auth.ts";
import path from "node:path";
import { transactionRoute } from "./routes/transactionRoute.js";
import { dataRoute } from "./routes/dataRoute.js";
import { fileURLToPath } from "node:url";
import { serverHealthRoute } from "./routes/serverHealthRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `.env.${environment}` });
const secret = process.env.SPIRAL_SESSION_SECRET;
const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 2122;

//initialize the postgres store constructor
const PostgresStore = pgSession(session);
const dbPool = await getDBConnection();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:2122",
      "http://localhost:3000",
      "https://spendora-khaki.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
      secure: is_Production,
      sameSite: is_Production ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(express.json());
// const publicFolder = path.join(__dirname, "../frontend/dist");

// app.use(express.static(publicFolder));
app.use("/api/auth/me", meRouter);
app.use("/api/auth", authRouter);
app.use("/api/transaction", transactionRoute);
app.use("/api/data", dataRoute);
app.use("/api/status", serverHealthRoute);

// app.get("/{*splat}", (req, res) => {
//   res.sendFile(path.join(publicFolder, "index.html"));
// });

app.listen(PORT, () => {
  try {
    console.log(`app live at Base_Ur:${PORT}`);
  } catch (err) {
    console.error("Error listening to port ", err.message);
  }
});
