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

      // Cascade delete: remove all transactions that use the deleted category name.
      const deletedCategoryName = action.payload.name.trim().toLowerCase();
      state.transactions = state.transactions.filter(
        (t) => t.category.trim().toLowerCase() !== deletedCategoryName,
      );

      localStorage.setItem("userCategories", JSON.stringify(state.categories));
      localStorage.setItem("userTransactions", JSON.stringify(state.transactions));
    },
    updateCategory: (state,action:PayloadAction<CategoryPropsType>) => {
      const selected = state.categories.findIndex((c) => c.id === action.payload.id)
      const nextCategoryName = action.payload.name.trim();

      if(selected !== -1 && nextCategoryName !== ''){
        const previousCategoryName = state.categories[selected].name.trim().toLowerCase();

        state.categories[selected] = { ...action.payload, name: nextCategoryName };

        // Cascade rename: update every transaction linked by category name.
        state.transactions = state.transactions.map((t) =>
          t.category.trim().toLowerCase() === previousCategoryName
            ? { ...t, category: nextCategoryName }
            : t,
        );

        localStorage.setItem("userCategories", JSON.stringify(state.categories));
        localStorage.setItem("userTransactions", JSON.stringify(state.transactions));
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
