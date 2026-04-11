export interface TransactionType {
  name: string;
  amount: number;
  date: string;
  category: string;
  transactionId: string;
  createdAt: number;
  type: "expense";
}

export interface IncomeType {
  amount: number;
  source: string;
  date: string;
  transactionId: string;
  createdAt: number;
  type: "income";
}

export interface CategoryPropsType {
  name: string;
  id: string;
}
