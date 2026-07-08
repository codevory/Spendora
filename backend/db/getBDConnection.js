import pkg from "pg";
import dotenv from "dotenv";
export const environment = process.env.NODE_ENV || "development";
export const is_Production =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

dotenv.config({ path: `.env.${environment}` });
const { Pool } = pkg;

let pool;
if (is_Production) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

export async function getDBConnection() {
  return pool;
}
