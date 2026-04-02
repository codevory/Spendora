import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TransactionType } from "../../types/transactionType";

interface TransactionState {
    transactions:TransactionType[],
    status:"idle" | "pending" | "failed" | "success",
    error:{message:string,code:number} | null,
}

const initialState:TransactionState = {
   transactions : [],
   status:"idle",
   error:null
   }


export const transactionSlice = createSlice({
name:'transaction',
initialState,
reducers : {
         addTransaction : (state,action:PayloadAction<TransactionType>) => {
             state.transactions.push(action.payload)
            },

          setTransactionStatus:(state,action:PayloadAction<TransactionState["status"]>) => {
             state.status = action.payload
          },

          setTransactionError : (state,action:PayloadAction<TransactionState["error"]>) => {
          state.error = action.payload
          },

          deleteTransaction: (state,action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter((trans) => trans.transactionId !== action.payload)
          },

          updateTransaction: (state,action: PayloadAction<TransactionType>) => {
          const index = state.transactions.findIndex((t) => t.transactionId === action.payload.transactionId);
          if(index !== -1){
            state.transactions[index] = action.payload
          }
          }
}
})

export default transactionSlice.reducer;
export const {
    addTransaction,
    setTransactionError,
    setTransactionStatus,
    deleteTransaction,
    updateTransaction
} = transactionSlice.actions