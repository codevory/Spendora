import { getDBConnection } from "../db/getBDConnection.js";

export async function dropTable(dbTableToDrop) {
  const dbToDrop = dbTableToDrop;
  const db = await getDBConnection();
  try {
    await db.exec(`DROP TABLE IF EXISTS ${dbToDrop} `);
    console.log("Table dropped successfully🎉");
  } catch (err) {
    console.error("Failed to drop table : ", err.message);
  } finally {
    await db.close();
    console.log("DB connection closed");
  }
}
dropTable("expenseCategories");
