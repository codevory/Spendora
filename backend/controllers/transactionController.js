import { getDBConnection } from "../db/getBDConnection.js";

let getExpenseCount = 0;

export async function getExpense(req, res) {
  if (!req.session.userId) {
    return res.status(400).json({ eror: "user not authenticated" });
  }

  const db = await getDBConnection();
  getExpenseCount += 1;

  try {
    const expensesResult = await db.query(
      `SELECT 
        e.id,
        e.amount,
        e.paid_to AS paidTo,
        e.paid_on AS date,
        e.transaction_id AS transactionId,
        c.name AS categoryName,
        e.category_id AS categoryId
        FROM userexpense e
        LEFT JOIN expensecategories c ON e.category_id = c.id
        WHERE e.user_id = $1`,
      [req.session.userId],
    );

    console.log("getExpense : ", getExpenseCount);
    return res.status(200).json({ expenses: expensesResult.rows });
  } catch (err) {
    console.error("Error getting expense : ", err.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
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
      "INSERT INTO userexpense (user_id,amount,paid_to,paid_on,category_id,transaction_id) VALUES($1,$2,$3,$4,$5,$6)",
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
    console.error("Failed to add expense ", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addIncome(req, res) {
  const { incomeData } = req.body;

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

    console.log(incomeData, " added successfully🎉");
    return res.status(201).json({ incomeData });
  } catch (err) {
    console.error("Failed to add income : ", err.message);
    return res
      .status(500)
      .json({ error: `Failed to add income ${err.message}` });
  }
}

export async function getIncome(req, res) {
  const db = await getDBConnection();

  try {
    const incomeResult = await db.query(
      "SELECT amount,source,recieved_on as date,transaction_id as transactionId,created_at as createdAt FROM userincome WHERE user_id = $1",
      [req.session.userId],
    );

    return res.status(200).json({ data: incomeResult.rows });
  } catch (err) {
    console.error("Failed to get income : ", err.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }
}
