import { createSlice } from "@reduxjs/toolkit";
import type { IncomeType } from "../../types/transactionType";
import type { PayloadAction } from "@reduxjs/toolkit";
import useLocalstorage from "../../Hooks/useLocalstorage";

interface incomeTransactionState {
    incomeTransactions: IncomeType[],
    status: "idle" | "failed" | "pending" | "success",
    error:{message:string,code:number} | null
}
const { userIncomeData } = useLocalstorage()
if(userIncomeData === undefined){
    localStorage.setItem("userIncomeData",JSON.stringify([]))
}
const initialState:incomeTransactionState = {
incomeTransactions : userIncomeData || [],
status : "idle",
error: null
}
export const incomeTransactionSlice = createSlice({
    name:"incomeTransaction",
    initialState,
    reducers :{
        addIncomeTransaction : (state,action:PayloadAction<IncomeType>) => {
          state.incomeTransactions.push(action.payload);
          localStorage.setItem("userIncomeData",JSON.stringify(state.incomeTransactions));
        },
        setTransactionError: (state,action:PayloadAction<incomeTransactionState['error']>) => {
        state.error = action.payload
        },
        setTransactionStatus: (state,action:PayloadAction<incomeTransactionState['status']>) => {
        state.status = action.payload
        } 
    }

})

export default incomeTransactionSlice.reducer;
export const { addIncomeTransaction } = incomeTransactionSlice.actions