import { getDBConnection } from "./getBDConnection.js";

export async function createExpenseTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS userExpense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            amount REAL,
            paid_to TEXT,
            paid_on TEXT,
            category_id INTEGER NOT NULL,
            transaction_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (category_id) REFERENCES expenseCategories(id)
            )`);
    console.log("expenseTable created in Db successfully🎉");
  } catch (err) {
    console.error("error : ", err.message);
  } finally {
    await db.close();
  }
}
createExpenseTable();
