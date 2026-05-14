import { getDBConnection } from "../db/getBDConnection";

export async function logTable(tableToLog) {
  const tableName = tableToLog || "users";
  const db = await getDBConnection();
  try {
    const table = await db.all(`SELECT * FROM ${tableName}`);
    console.table(table);
  } catch (err) {
    console.error("Error occured :", err.message);
  } finally {
    await db.close();
    console.log("DB connection closed");
  }
}
logTable();
