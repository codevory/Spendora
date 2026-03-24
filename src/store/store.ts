import { configureStore } from "@reduxjs/toolkit";

export const Store = configureStore({
    reducer:{},
})

export type AppSelector = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;