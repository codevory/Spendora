import { getDBConnection } from "./getBDConnection.js";

async function createTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS expenseCategories(
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             user_id INTEGER NOT NULL,
             name TEXT NOT NULL,
             FOREIGN KEY (user_id) REFERENCES users(id)
            )`);
    console.log("Table expenseCategories created successfully🎉");
  } catch (error) {
    console.error("Error creating category Table ", error.message);
  }
}
createTable();
