import { getDBConnection } from "../db/getBDConnection.js";
import type { Request, Response } from "express";

type TransactionItem = {
  amount: number;
  entity: string;
  date: string;
  categoryId: string | number;
  transactionId: string;
};

type ExpenseRequestBody = {
  transactionData: TransactionItem;
};

type IncomeItem = {
  amount: number;
  entity: string;
  date: string;
  transactionId: string;
};

type IncomeRequestBody = {
  incomeData: IncomeItem;
};

type QueryParamsType = {
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

type CustomQueryParamsType = {
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


  let now = new Date()
  let startDateDefault = new Date(now.getFullYear(), now .getMonth() - 3, now.getDate())
  let endDateDefault = now

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
    e.paid_to AS "entity",
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
      transactionData.entity,
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
      'INSERT INTO userincome (user_id,amount,source,transaction_id,received_on) VALUES($1,$2,$3,$4,$5) RETURNING id,amount,source AS entity, received_on as date,transaction_id as "transactionId",created_at as "createdAt" ',
      [
        req.session.userId,
        incomeData.amount,
        incomeData.entity,
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

export async function getIncome(req: RequestWithSession<unknown,unknown,unknown,CustomQueryParamsType>, res: Response) {
  const db = await getDBConnection();

  const { page, size, skip, from, to} = req.query

 let start_date = !from ? startDateDefault : new Date(from)
 let end_date = !to ? endDateDefault : new Date(to)
 end_date.setHours(23,59,59,999)

  let pageNum = page !== undefined && parseInt(page) > 0 ? Math.max(parseInt(page), 1) : 1
  if(isNaN(pageNum) || pageNum < 0){
  pageNum = 1
  }

  let dataSize = size !== undefined ? Math.min(parseInt(size), 250) : 250
  if(isNaN(dataSize) || dataSize < 0){
    dataSize = 250
  }

  let dataToSkip = skip !== undefined && parseInt(skip) > 0 ? Math.max(parseInt(skip), 0) : (pageNum - 1) * dataSize
  if(isNaN(dataToSkip) || dataToSkip < 0){
    dataToSkip = (pageNum - 1) * dataSize
  }

  try {
    const incomeResult = await db.query(
      `SELECT 
       id,
       amount,
       source AS entity,
       received_on as "date",
       transaction_id as "transactionId",
       created_at as "createdAt" 
       FROM userincome 
       WHERE user_id = $1 AND received_on >= $2
       AND received_on <= $3

       ORDER BY received_on DESC
       LIMIT $4
       OFFSET $5
       `,
      [req.session.userId,start_date,end_date,dataSize,dataToSkip],
    );

    return res.status(200).json({
      meta: {
       page: pageNum,
       skip: dataToSkip,
       from: start_date,
       to: end_date,
       size: {
         requested: dataSize,
         received: incomeResult.rows.length
       }
      },
      incomes: incomeResult.rows,
      });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to get income : ", error.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }
}

export async function getRecentTransactions(
  req: RequestWithSession<unknown, unknown, unknown, CustomQueryParamsType>,
  res: Response,
) {
  const db = await getDBConnection();
  const { page, size, skip, from, to } = req.query;

  let start_date = !from ? startDateDefault : new Date(from)
  let end_date = !to ? endDateDefault : new Date(to)
  end_date.setHours(23,59,59,999)

  let pageNum:number = page !== undefined ? Math.max(parseInt(page), 1) : 1;
  if(isNaN(pageNum) || pageNum < 0){
    pageNum = 1
  }

  let dataSize:number = size !== undefined ? Math.min(parseInt(size),20) : 20 ;
  if(isNaN(dataSize) || dataSize < 0){
    dataSize = 20
  }

  let dataToSkip = skip !== undefined ? parseInt(skip) : (pageNum - 1) * dataSize;
  if(isNaN(dataToSkip) || dataToSkip < 0){
    dataToSkip = 0;
    pageNum = 1;
  }

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
 AND ui.received_on >= $2 AND ui.received_on <= $3
)
ORDER BY "date" DESC
 LIMIT $4
 OFFSET $5
 ;
    `,
      [req.session.userId,start_date,end_date, dataSize, dataToSkip],
    );

    return res.status(200).json({
      meta: {
        page: pageNum,
        skip: dataToSkip,
        from: start_date,
        to: end_date,
        size: {
          requested: dataSize,
          received: txnResult.rows.length
        }
      },
      transactions: txnResult.rows,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error " });
  }
}

export async function getExpense(req:CustomRequestWithSession<unknown,unknown,unknown,CustomQueryParamsType>,res:Response){
  const db:any = await getDBConnection()

  let { query,page,size,skip,from,to } = req.query

  let search_query = !query || query.trim() === '' ? null : query?.trim().toLowerCase()
  let pageNum = page !== undefined ? Math.max(Number(page), 1) : 1;
  let dataSize = !size || Number(size) < 0 ? 250 : Math.min(Number(size), 250)

  let dataToSkip = pageNum == 1 ? 0 : skip !== undefined ? Number(skip) : (pageNum - 1) * dataSize ;
  if(isNaN(dataToSkip) || dataToSkip < 0){
    pageNum = 1
    dataToSkip = 0
  }

  let start_date = !from ? startDateDefault : new Date(from)
  let end_date = !to ? endDateDefault : new Date(to)
  end_date.setHours(23,59,59,999)

  console.log("query :",query," page :",pageNum," size :",dataSize," skip :",dataToSkip," from :",start_date," to : ",end_date)
  
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
     ;`,[req.session.userId,search_query,start_date,end_date,dataSize,dataToSkip]
    )
    return res.status(200).json({
      meta:{
        query: search_query,
        page: pageNum,
        skip: dataToSkip,
        from: start_date,
        to: end_date,
        size:{
          requested:dataSize,
          received:result.rows.length
        }
      },
      expenses : result.rows
    })

  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Failed to get filtered expense : ", error.message);
    return res.status(500).json({ error: ` Internal Server Error ` });
  }

}