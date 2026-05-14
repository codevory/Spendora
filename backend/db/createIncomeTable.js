import { getDBConnection } from "./getBDConnection.js";

export async function createIncomeTable() {
  const db = await getDBConnection();

  try {
    await db.exec(`CREATE TABLE IF NOT EXISTS userIncome (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            source TEXT NOT NULL,
            transaction_id TEXT NOT NULL,
            recieved_on DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
            );`);
    console.log("userIncome table created successfully🎉");
  } catch (err) {
    console.error("Failed to create userIncome Table : ", err.message);
  } finally {
    await db.close();
    console.log("Db connection closed");
  }
}

createIncomeTable();
