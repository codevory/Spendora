import { getDBConnection } from "../db/getBDConnection.js";
import validator from "validator";
let getExpenseCount = 0;

export async function getExpense(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ eror: "user not authenticated" });
  }
  const db = await getDBConnection();

  try {
    const expensesResult = await db.query(
      "SELECT * FROM userexpense WHERE user_id = $1",
      [req.session.userId],
    );

    const expenses = expensesResult.rows;
    return res.status(200).json({ expenses });
  } catch (err) {
    console.error("Error getting expense : ", err.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
  return () => clearTimeout(timer);
}

export async function addExpense(req, res) {
  const db = await getDBConnection();
  const { transactionData } = req.body;
  console.log(transactionData);

  if (
    typeof transactionData.amount !== "number" ||
    transactionData.amount <= 0
  ) {
    return res.status(400).json({ error: "Inavlid amount" });
  }

  try {
    await db.query(
      "INSERT INTO userexpense (user_id,amount,paid_to,paid_on,category,transaction_id) VALUES($1,$2,$3,$4,$5,$6)",
      [
        req.session.userId,
        transactionData.amount,
        transactionData.paidTo,
        transactionData.date,
        transactionData.categoryId,
        transactionData.transactionId,
      ],
    );

    return res.status(201).json({ message: "Expense Added successfully🎉" });
  } catch (err) {
    console.error("Failed to add expense ", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addIncome(req, res) {
  const { incomeData } = req.body;
  if (typeof incomeData.amount !== "number" || incomeData.amount <= 0) {
  if (typeof incomeData.amount !== "number" || incomeData.amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const db = await getDBConnection();

  try {
    await db.query(
      "INSERT INTO userincome (user_id,amount,source,transaction_id,recieved_on) VALUES($1,$2,$3,$4,$5)",
      [
        req.session.userId,
        incomeData.amount,
        incomeData.source,
        incomeData.transactionId,
        incomeData.date,
      ],
    );

    return res.status(201).json({ response: "Income added successfully🎉" });
  } catch (err) {
    console.error("Failed to add income : ", err.message);
    return res.status(500).json({ error: `Internal Server Error` });
  }
}

export async function getIncome(req, res) {
  const db = await getDBConnection();
  try {
    const incomeResult = await db.query(
      "SELECT * FROM userincome WHERE user_id = $1",
      [req.session.userId],
    );

    const data = incomeResult.rows;
    return res.status(200).json({ data });
  } catch (err) {
    console.error("Failed to get income : ", err.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }
}
