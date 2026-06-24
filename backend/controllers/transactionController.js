import { getDBConnection } from "../db/getBDConnection.js";
import validator from "validator";
let getExpenseCount = 0;

export async function getExpense(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ eror: "user not authenticated" });
  }
  const db = await getDBConnection();
  getExpenseCount += 1;
  let timer;
  try {
    timer = setTimeout(async () => {
      const expenses = await db.all(
        `SELECT 
        e.id,
        e.amount,
        e.paid_to AS paidTo,
        e.paid_on AS date,
        e.transaction_id AS transactionId,
        c.name AS categoryName,
        e.category_id AS categoryId
        FROM userExpense e
        LEFT JOIN expenseCategories c ON e.category_id = c.id
        WHERE e.user_id = ?`,
        [req.session.userId],
      );

      console.log("getExpense : ", getExpenseCount);
      res.status(200).json({ expenses });
    }, 200);
  } catch (err) {
    console.log("getExpense : ", getExpenseCount);
    res.status(500).json({ eror: err.message });
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
    await db.run(
      "INSERT INTO userExpense (user_id,amount,paid_to,paid_on,category_id,transaction_id) VALUES(?,?,?,?,?,?)",
      [
        req.session.userId,
        transactionData.amount,
        transactionData.paidTo,
        transactionData.date,
        transactionData.categoryId,
        transactionData.transactionId,
      ],
    );

    return res.status(201).json({ transactionData });
  } catch (err) {
    console.error("Failed to add expense ", err);
    res.status(502).json({ error: `Failed to add expense ${err.message}` });
  }
}
export async function addIncome(req, res) {
  const { incomeData } = req.body;
  if (typeof incomeData.amount !== "number" || incomeData.amount <= 0) {
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

    console.log(incomeData, " added successfully🎉");
    res.status(201).json({ incomeData });
  } catch (err) {
    console.error(err.message ?? "failed to add income");
    res.status(500).json({ error: `Failed to add income ${err.message}` });
  }
}
export async function getIncome(req, res) {
  const db = await getDBConnection();
  try {
    const data = await db.all(
      "SELECT amount,source,recieved_on as date,transaction_id as transactionId,created_at as createdAt FROM userIncome WHERE user_id = ?",
      [req.session.userId],
    );
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: `Failed to get income Txns ${err.message}` });
  }
}
