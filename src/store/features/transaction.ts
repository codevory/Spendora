import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TransactionType } from "../../types/transactionType";
import useLocalstorage from "../../Hooks/useLocalstorage";
import { safeParseArray } from "../../utils/safeParseArray";

interface TransactionState {
    transactions:TransactionType[],
    status:"idle" | "pending" | "failed" | "success",
    error:{message:string,code:number} | null,
}


const {data} = useLocalstorage()

if(data === undefined){
  localStorage.setItem("userTransactions",JSON.stringify([]))
}
const initialState:TransactionState = {
   transactions : data || [] ,
   status:"idle",
   error:null
   }


export const transactionSlice = createSlice({
name:'transaction',
initialState,
reducers : {
         addTransaction : (state,action:PayloadAction<TransactionType>) => {
             state.transactions.push(action.payload);
             localStorage.setItem("userTransactions",JSON.stringify(state.transactions))
            },

          setTransactionStatus:(state,action:PayloadAction<TransactionState["status"]>) => {
             state.status = action.payload
          },

          setTransactionError : (state,action:PayloadAction<TransactionState["error"]>) => {
          state.error = action.payload
          },

          deleteTransaction: (state,action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter((trans) => trans.transactionId !== action.payload);
            localStorage.setItem("userTransactions",JSON.stringify(state.transactions))
          },

          updateTransaction: (state,action: PayloadAction<TransactionType>) => {
          const index = state.transactions.findIndex((t) => t.transactionId === action.payload.transactionId);
          if(index !== -1){
            state.transactions[index] = action.payload
          }
          localStorage.setItem("userTransactions",JSON.stringify(state.transactions))
          },
          addNewCategory:(state,action:PayloadAction<string>) => {
            const nextCategory = action.payload.trim();
            if (!nextCategory) return;

            const existingCategories = safeParseArray<string>(localStorage.getItem("userCategories"));
            const mergedCategories = [...new Set([...existingCategories, ...state.transactions.map((txn) => txn.category), nextCategory])];

            localStorage.setItem("userCategories", JSON.stringify(mergedCategories));
            
          }

}
})

export default transactionSlice.reducer;
export const {
    addTransaction,
    setTransactionError,
    setTransactionStatus,
    deleteTransaction,
    updateTransaction,
    addNewCategory
} = transactionSlice.actions