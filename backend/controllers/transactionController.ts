import { getDBConnection } from "../db/getBDConnection.js";
import type { Request, Response } from "express";

type TransactionItem = {
  amount: number;
  paidTo: string;
  date: string;
  categoryId: string | number;
  transactionId: string;
};

type ExpenseRequestBody = {
  transactionData: TransactionItem;
};

type IncomeItem = {
  amount: number;
  source: string;
  date: string;
  transactionId: string;
};

type IncomeRequestBody = {
  incomeData: IncomeItem;
};

type TransactionQuery = {
  page?: string
  size?: string
  skip?: string
};

type SessionUser = {
  userId: string;
  userRole?: string;
  email?: string;
};

type RequestWithSession<
  Params = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  session: SessionUser;
};

type CustomExpenseTransactionQuery = {
  query? : string
  page? : string
  size? : string
  skip? : string
  from? : string
  to?   : string
}

type CustomRequestWithSession<
Params = unknown,
ReqBody = unknown,
ResBody = unknown,
ReqQuery = unknown> = Request<Params,ReqBody,ResBody,ReqQuery> & {
  session: SessionUser
} 

export async function getExpense(req: RequestWithSession, res: Response) {
  const db = await getDBConnection();

  try {
    const expensesResult = await db.query(
      `SELECT 
        e.id,
        e.amount,
        e.paid_to AS entity,
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
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error getting expense : ", error.message);
    return res.status(500).json({ error: "Internal server Error" });
  }
}

export async function addExpense(
  req: RequestWithSession<unknown, unknown, ExpenseRequestBody>,
  res: Response,
) {
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
    const query = `
    WITH inserted_expense AS (
    INSERT INTO userexpense (user_id,amount, paid_to,paid_on,category_id,transaction_id) VALUES($1,$2,$3,$4,$5,$6) 
    RETURNING id,amount,paid_to ,transaction_id , paid_on,category_id
    )
    SELECT 
    e.id,
    e.amount,
    e.paid_to AS "paidTo",
    e.paid_on AS "date",
    e.category_id AS "categoryId",
    e.transaction_id AS "transactionId",
    c.name AS "categoryName"
    FROM inserted_expense e
    LEFT JOIN expensecategories c ON c.id = e.category_id AND c.user_id = $1;
   `;

    const expenseCreated = await db.query(query, [
      req.session.userId,
      transactionData.amount,
      transactionData.paidTo,
      transactionData.date,
      transactionData.categoryId,
      transactionData.transactionId,
    ]);

    if (expenseCreated.rows.length === 0) {
      return res.status(400).json({ error: "Failed to create transaction " });
    }

    return res.status(201).json({ transactionData: expenseCreated.rows[0] });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to add expense ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addIncome(
  req: RequestWithSession<unknown, unknown, IncomeRequestBody>,
  res: Response,
) {
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
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to add income : ", error.message);
    return res
      .status(500)
      .json({ error: `Failed to add income ${error.message}` });
  }
}

export async function getIncome(req: RequestWithSession, res: Response) {
  const db = await getDBConnection();

  try {
    const incomeResult = await db.query(
      'SELECT id,amount,source AS entity, received_on as date,transaction_id as "transactionId",created_at as "createdAt" FROM userincome WHERE user_id = $1',
      [req.session.userId],
    );

    return res.status(200).json({ income: incomeResult.rows });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to get income : ", error.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }
}

export async function getTransactions(
  req: RequestWithSession<unknown, unknown, unknown, TransactionQuery>,
  res: Response,
) {
  const db = await getDBConnection();
  const { page, size, skip } = req.query;

  let pageNum:number = page !== undefined ? parseInt(page) : 1;
  let dataSize:number = size !== undefined ? parseInt(size) : 5;
  let dataToSkip = skip !== undefined ? parseInt(skip) : pageNum === 1 ? 0 : (pageNum - 1) * dataSize;

  console.log("page :", pageNum, "size :", dataSize, "skip : ", dataToSkip);
  try {
    const txnResult = await db.query(
      `
 (
  SELECT
 e.id,
 e.amount,
 'expense' AS "type",
 e.paid_to AS "entity",
 e.paid_on AS "date",
 e.transaction_id AS "transactionId",
 e.category_id AS "categoryId",
 c.name AS "categoryName",
 e.created_at AS "createdAt"
 FROM userexpense e
 LEFT JOIN expensecategories c ON e.category_id = c.id
 WHERE e.user_id = $1
)
UNION ALL
(
 SELECT
 ui.id,
 ui.amount,
 'income' AS "type",
 ui.source AS "entity",
 ui.received_on AS "date",
 ui.transaction_id AS "transactionId",
 NULL AS "categoryId",
 NULL AS "categoryName",
 ui.created_at AS "createdAt"
 FROM userincome ui
 WHERE ui.user_id = $1
)
ORDER BY "date" DESC
 LIMIT $2
 OFFSET $3
 ;
    `,
      [req.session.userId, dataSize, dataToSkip],
    );

    return res.status(200).json({
      page: page,
      size: size,
      transactions: txnResult.rows,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error " });
  }
}

export async function getFilteredExpense(req:CustomRequestWithSession<unknown,unknown,unknown,CustomExpenseTransactionQuery>,res:Response){
  const db:any = await getDBConnection()

  let date = new Date()
  let prev_month = new Date().getMonth();
  let day = date.getUTCDate() + 1
  let start_date = new Date(`${date.getFullYear()} / ${prev_month} / ${day}`)
  let end_date = new Date()

  let { query,page,size,skip,from,to } = req.query
  let search_query = query === undefined  || query === '' || query === " " ? null : query?.trim().toLowerCase()
  let pageNum:number = page !== undefined ? Number(page) : 1;
  let dataSize = size !== undefined ? Number(size) : 10;
  let dataToSkip = pageNum <= 1 ? 0 : skip !== undefined ? Number(skip) : (pageNum - 1) * dataSize
  let startDate = from === undefined  || from  === '' ? start_date : new Date(from)
  let endDate = to == undefined || to == '' ? end_date : new Date(to)
  endDate.setHours(23,59,59,999)

  console.log("query :",query," page :",pageNum," size :",dataSize," skip :",dataToSkip," from :",startDate," to : ",endDate)
  try {
    
    const result = await db.query(
     `SELECT
     e.id,
     e.amount,
     e.paid_to AS entity,
     e.paid_on AS "date",
     e.transaction_id AS "transactionId",
     e.category_id AS "categoryId",
     c.name AS "categoryName",
     e.created_at AS "createdAt",
     'expense' AS "type"
     FROM userexpense e
     LEFT JOIN expensecategories c ON e.category_id = c.id
     WHERE e.user_id = $1 
     AND e.paid_on >= $3 
     AND e.paid_on <= $4
     AND ($2::TEXT IS NULL OR $2 = ' ' OR c.name = $2::TEXT)
     ORDER BY e.paid_on DESC
     LIMIT $5
     OFFSET $6
     ;`,[req.session.userId,search_query,startDate,endDate,dataSize,dataToSkip]
    )
    return res.status(200).json({expenses : result.rows})

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to get filtered expense : ", error.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }

}