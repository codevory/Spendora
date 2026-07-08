export interface ExpenseTransaction {
  id: number;
  amount: number;
  type: "expense";
  entity: string;
  date: Date;
  transactionId: string;
  categoryId: number;
  categoryName: string;
  createdAt: Date;
}

export interface IncomeTransaction {
  id: number;
  amount: number;
  type: "income";
  entity: string;
  date: Date;
  transactionId: string;
  categoryId: null;
  categoryName: null;
  createdAt: Date;
}

export type Transaction = ExpenseTransaction | IncomeTransaction;

export interface GetTransactionsResponse {
  transactions: Transaction[];
  page: number;
  size: number;
}
export type RecentTransactionsType = {
  page ? : number,
  size ? : number,
  skip ? : number
}