import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./features/userAuthenication";
import TransactionReducer from "./features/transactionUpdate";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import userOriginReducer from "./features/userSelections";
import { transactionApi } from "./features/transactionApi";

const Store = configureStore({
  reducer: {
    userData: userAuthReducer,
    origin: userOriginReducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    TransactionId: TransactionReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(transactionApi.middleware),
});

export default Store;

export type AppDispatch = typeof Store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof Store.getState>
> = useSelector;
