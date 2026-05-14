import { getDBConnection } from "../db/getBDConnection.js";
import validator from "validator";

export async function getExpense(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ eror: "user not authenticated" });
  }
  const db = await getDBConnection();
  try {
    const expenses = await db.all(
      "SELECT * FROM userExpense WHERE user_id = ?",
      [req.session.userId],
    );
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(400).json({ eror: err.message });
  }
}
export async function addExpense(req, res) {
  const db = await getDBConnection();
  const { transactionData } = req.body;
  console.log(transactionData);
  if (typeof transactionData.amount !== Number && transactionData.amount <= 0) {
    return res.status(400).json({ error: "Inavlid amount" });
  }

  try {
    await db.run(
      "INSERT INTO userExpense (user_id,amount,paid_to,paid_on,category,transaction_id) VALUES(?,?,?,?,?,?)",
      [
        req.session.userId,
        transactionData.amount,
        transactionData.name,
        transactionData.date,
        transactionData.category,
        transactionData.transactionId,
      ],
    );
    res.status(201).json({ message: "Expense Added successfully🎉" });
  } catch (err) {
    console.error("Failed to add expense ", err);
    res.status(502).json({ error: `Failed to add expense ${err.message}` });
  }
}
export async function addIncome(req, res) {
  const { incomeData } = req.body;
  if (typeof incomeData.amount !== Number && incomeData.amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const db = await getDBConnection();
  try {
    await db.run(
      "INSERT INTO userIncome (user_id,amount,source,transaction_id,recieved_on) VALUES(?,?,?,?,?)",
      [
        req.session.userId,
        incomeData.amount,
        incomeData.source,
        incomeData.transactionId,
        incomeData.date,
      ],
    );
    res.status(201).json({ message: "Income added successfully🎉" });
  } catch (err) {
    res.status(400).json({ error: `Failed to add income ${err.message}` });
  }
}
export async function getIncome(req, res) {
  const db = await getDBConnection();
  try {
    const data = await db.all("SELECT * FROM userIncome WHERE user_id = ?", [
      req.session.userId,
    ]);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: `Failed to get income Txns ${err.message}` });
  }
}
