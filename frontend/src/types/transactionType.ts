// export interface TransactionType {
//   paid_to: string;
//   amount: number;
//   date: string;
//   category:string;
//   transactionId: string;
//   created_at: number;
//   type: "expense";
// }

export interface expenseTranscationTypes {
  // paid_to:string
  // date:string
  // amount:number
  // category:string
  // transactionId: string;
  // created_at: number;
  // type: "expense";
  id?: number;              // Database autoincrement ID
  userId?: number;
  amount: number;
  paidTo: string;
  date: string;
  categoryId: number;       // Ties directly to your database foreign key
  categoryName ?: string;    // Joined from the categories table for easy rendering
  transactionId: string;    // Your frontend generated tracking UUID
  createdAt?: string;
  type:"expense"
}

export interface IncomeTransactionTypes {
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
export interface CategoryPropsTypeDB {
  name:string,
  id:number
}