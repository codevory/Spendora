import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  TransactionType,
  CategoryPropsType,
} from "../../types/transactionType";
import useLocalstorage from "../../Hooks/useLocalstorage";

interface TransactionState {
  categories: CategoryPropsType[];
  transactions: TransactionType[];
  status: "idle" | "pending" | "failed" | "success";
  error: { message: string; code: number } | null;
}

const { data, userCategories } = useLocalstorage();

if (userCategories === undefined) {
  localStorage.setItem("userCategories", JSON.stringify([]));
}

if (data === undefined) {
  localStorage.setItem("userTransactions", JSON.stringify([]));
}
const initialState: TransactionState = {
  categories: userCategories || [],
  transactions: data || [],
  status: "idle",
  error: null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionType>) => {
      state.transactions.push(action.payload);
      localStorage.setItem(
        "userTransactions",
        JSON.stringify(state.transactions),
      );
    },

    setTransactionStatus: (
      state,
      action: PayloadAction<TransactionState["status"]>,
    ) => {
      state.status = action.payload;
    },

    setTransactionError: (
      state,
      action: PayloadAction<TransactionState["error"]>,
    ) => {
      state.error = action.payload;
    },

    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (trans) => trans.transactionId !== action.payload,
      );
      localStorage.setItem(
        "userTransactions",
        JSON.stringify(state.transactions),
      );
    },

    updateTransaction: (state, action: PayloadAction<TransactionType>) => {
      const index = state.transactions.findIndex(
        (t) => t.transactionId === action.payload.transactionId,
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      localStorage.setItem(
        "userTransactions",
        JSON.stringify(state.transactions),
      );
    },
    addNewCategory: (state, action: PayloadAction<CategoryPropsType>) => {
      state.categories.push(action.payload);
      localStorage.setItem("userCategories", JSON.stringify(state.categories));
    },
    deleteCategory: (state, action: PayloadAction<CategoryPropsType>) => {
      const removeCategory = state.categories.filter(
        (cat) => cat.id !== action.payload.id,
      );
      state.categories = removeCategory;
      localStorage.setItem("userCategories", JSON.stringify(state.categories));
    },
    updateCategory: (state,action:PayloadAction<CategoryPropsType>) => {
      const selected = state.categories.find((c) => c.id === action.payload.id)
      if(selected !== undefined && action.payload.name !== ''){
        selected.name = action.payload.name
        localStorage.setItem("userCategories", JSON.stringify(state.categories));
      }
      else{
        throw new Error("Failed to update category from store")
      }
    },
  }})


export default transactionSlice.reducer;
export const {
  addTransaction,
  setTransactionError,
  setTransactionStatus,
  deleteTransaction,
  updateTransaction,
  addNewCategory,
  deleteCategory,
  updateCategory
} = transactionSlice.actions;
