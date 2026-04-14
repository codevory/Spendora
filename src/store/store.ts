import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./features/transaction";
import incomeTransactionReducer from "./features/incomeTransaction";
import userAuthReducer from "./features/userAuthenication";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";

const Store = configureStore({
  reducer: {
    transaction: transactionReducer,
    incomeTransaction: incomeTransactionReducer,
    userData: userAuthReducer,
  },
});

export default Store;

export type AppDispatch = typeof Store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof Store.getState>
> = useSelector;
