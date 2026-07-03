import { getDBConnection } from "../db/getBDConnection.js";

export async function getExpense(req, res) {
  const db = await getDBConnection();

  try {
    const expensesResult = await db.query(
      `SELECT 
        e.id,
        e.amount,
        e.paid_to AS "paidTo",
        e.paid_on AS date,
        e.transaction_id AS "transactionId",
        c.name AS "categoryName",
        e.category_id AS "categoryId"
        FROM userexpense e
        LEFT JOIN expensecategories c ON e.category_id = c.id
        WHERE e.user_id = $1`,
      [req.session.userId],
    );

    return res.status(200).json({ expenses: expensesResult.rows });
  } catch (err) {
    console.error("Error getting expense : ", err.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
}

export async function addExpense(req, res) {
  const db = await getDBConnection();
  let { transactionData } = req.body;

  if (!transactionData || typeof transactionData !== "object") {
    return res.status(400).json({ error: "transaction data is required" });
  }

  if (
    typeof transactionData.amount !== "number" ||
    transactionData.amount <= 0
  ) {
    return res.status(400).json({ error: "Inavlid amount" });
  }

  if (!transactionData.categoryId) {
    return res.status(400).json({ error: "categoryId is required" });
  }

  try {
    const expenseCreated = await db.query(
      'INSERT INTO userexpense (user_id,amount, paid_to,paid_on,category_id,transaction_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,amount,paid_to AS "paidTo",transaction_id AS "transactionId", paid_on AS date,category_id AS "categoryId"',
      [
        req.session.userId,
        transactionData.amount,
        transactionData.paidTo,
        transactionData.date,
        transactionData.categoryId,
        transactionData.transactionId,
      ],
    );

    const category = await db.query(
      "SELECT name AS categoryName FROM expenseCategories WHERE user_id = $1 AND id = $2",
      [req.session.userId, parseInt(expenseCreated.rows[0].categoryId)],
    );

    transactionData = expenseCreated.rows[0];
    transactionData.categoryName = category.rows[0].categoryame ?? null;

    return res.status(201).json({ transactionData });
  } catch (err) {
    console.error("Failed to add expense ", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addIncome(req, res) {
  let { incomeData } = req.body;

  if (!incomeData || typeof incomeData !== "object") {
    return res.status(400).json({ error: "income data is required" });
  }

  if (typeof incomeData.amount !== "number" || incomeData.amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const db = await getDBConnection();

  try {
    const incomeCreated = await db.query(
      'INSERT INTO userincome (user_id,amount,source,transaction_id,received_on) VALUES($1,$2,$3,$4,$5) RETURNING id,amount,source, received_on as date,transaction_id as "transactionId",created_at as "createdAt" ',
      [
        req.session.userId,
        incomeData.amount,
        incomeData.source,
        incomeData.transactionId,
        incomeData.date,
      ],
    );

    incomeData = incomeCreated.rows[0];

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
      'SELECT id,amount,source, received_on as date,transaction_id as "transactionId",created_at as "createdAt" FROM userincome WHERE user_id = $1',
      [req.session.userId],
    );

    return res.status(200).json({ income: incomeResult.rows });
  } catch (err) {
    console.error("Failed to get income : ", err.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }
}
