import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./features/transaction";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

const Store = configureStore({
    reducer:{
        transaction:transactionReducer,
    },
});

export default Store;

export const useAppDispatch : () => typeof Store.dispatch = useDispatch;
export const useAppSelector : TypedUseSelectorHook<ReturnType <typeof Store.getState>> = useSelector;