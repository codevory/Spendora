export interface ExpenseTransaction {
  id: number;
  amount: number;
  type: 'expense';          // The "discriminant" literal
  entity: string;          // Maps to paid_to
  date: Date;
  transactionId: string;
  categoryId: number;      // Specific to expenses
  categoryName: string;    // Specific to expenses
  createdAt: Date;
}

export interface IncomeTransaction {
  id: number;
  amount: number;
  type: 'income';           // The "discriminant" literal
  entity: string;          // Maps to source
  date: Date;
  transactionId: string;
  categoryId: null;        // Null placeholder from our SQL
  categoryName: null;      // Null placeholder from our SQL
  createdAt: Date;
}

// The Union Data Type
export type Transaction = ExpenseTransaction | IncomeTransaction;

// The API response structure
export interface GetTransactionsResponse {
  transactions: Transaction[];
  page: number;
  size: number;
}