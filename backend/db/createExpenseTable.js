import { getDBConnection } from "./getBDConnection.js";

export async function createExpenseTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS userExpense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            paid_to TEXT NOT NULL,
            paid_on DATE NOT NULL,
            category TEXT NOT NULL,
            transaction_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
            )`);
    console.log("expenseTable created in Db successfully🎉");
  } catch (err) {
    console.error("error : ", err.message);
  } finally {
    await db.close();
  }
}
createExpenseTable();
