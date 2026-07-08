
export interface expenseTranscationTypes {
  id: number;              // Database autoincrement ID
  amount: number;
  paidTo: string;
  date: string;
  categoryId: number;       // Ties directly to your database foreign key
  categoryName : string ;    // Joined from the categories table for easy rendering
  transactionId: string;    // Your frontend generated tracking UUID
  createdAt: string;
  type:"expense"
}

export interface IncomeTransactionTypes {
  id:number
  amount: number;
  source: string;
  date: string;
  transactionId: string;
  createdAt: number;
  type: "income";
}

export type CategoryPropsType  = {
  name: string;
  id : number
}

export type RecentTransactionsType = {
  page ? : number,
  size ? : number,
  skip ? : number
}