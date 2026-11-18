import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TransactionState {
  ids: string[];
}

const initialState: TransactionState = {
  ids: [],
};

const TransactionSlice = createSlice({
  name: "Transactions",
  initialState,
  reducers: {
    addTransactionToDeletionQueue: (state, action: PayloadAction<string[]>) => {
      state.ids = action.payload;
    },
  },
});

export const { addTransactionToDeletionQueue
 } = TransactionSlice.actions;
export default TransactionSlice.reducer;
