export interface ExpenseTransaction {
  id: number;
  amount: number;
  type: "expense";
  entity: string;
  date: string;
  transactionId: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface IncomeTransactionResponse {
  id: number;
  amount: number;
  type: "income";
  entity: string;
  date: string;
  transactionId: string;
  categoryId: null;
  categoryName: null;
  createdAt: string;
}

export type Transaction = ExpenseTransaction | IncomeTransactionResponse;

export interface GetRecentTransactionsResponse {
  meta: {
    page: number
    skip: number
    from : string
    to: string
    size: {
      requested: number
      received: number
    }
  },
  transactions: Transaction[];
}
export type RecentTransactionsType = {
  page ? : number,
  size ? : number,
  skip ? : number
}