
export interface expenseTranscationTypes {
  id: number;              // Database autoincrement ID
  amount: number;
  entity: string;
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
  entity: string;
  date: string;
  transactionId: string;
  createdAt: string;
  type: "income";
  categoryId:null;
  categoryName:null
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
import { useAddExpenseTxnMutation } from "../store/features/transactionApi.ts";
import type { useAddCategoryMutation, useDeleteCategoryMutation, useRenameCategoryMutation, useAddIncomeTxnMutation } from "../store/features/transactionApi.ts";

// 1. Extract the full tuple type
type AddExpenseMutationTuple = ReturnType<typeof useAddExpenseTxnMutation>;

// 2. Extract the individual pieces by index
export type AddTxnTriggerFn = AddExpenseMutationTuple[0]; // Type of addTxn
export type AddTxnStatusObj = AddExpenseMutationTuple[1]; // Type of { isLoading, isSuccess, etc }

type AddCategoryMutationTuple = ReturnType<typeof useAddCategoryMutation>;
type AddIncomeMutationTuple = ReturnType<typeof useAddIncomeTxnMutation>;
type RenameCategoryMutationTuple = ReturnType<typeof useRenameCategoryMutation>;
type DeleteCategoryMutationTuple = ReturnType<typeof useDeleteCategoryMutation>;

export type AddCategoryTriggerFn = AddCategoryMutationTuple[0];
export type AddIncomeTriggerFn = AddIncomeMutationTuple[0];
export type RenameCategoryTriggerFn = RenameCategoryMutationTuple[0];
export type DeleteCategoryTriggerFn = DeleteCategoryMutationTuple[0];

export interface handleAddExpenseTransactionProps {
  amount: number | "";
  category: string;
  transaction: expenseTranscationTypes;
  e: React.SubmitEvent<HTMLFormElement>;
  success: () => void;
  failed: (val: string) => string;
  setAmount: (val: number | "") => void;
  setPayee: (val: string) => void;
  setIsSubmitting: (val: boolean) => void;
  addTxn:AddTxnTriggerFn

}

export interface expenseTransactionParamsType {
query ? : string
page ? : number
size ? : number
skip ? : number
from ? : string | Date,
to ? : string | Date

}

export type ResponseuserDataType = {
  fullName:string
  email:string
  username:string 
  currency:string 
  created_at:string
}

