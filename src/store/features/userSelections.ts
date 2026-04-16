import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserOriginItem } from "../../Hooks/useUserData";

const defaultUserOrigin: UserOriginItem = {
    key: "IN",
    country: "India",
    currencySymbol: "₹",
};

function getInitialUserOrigin() {
    const savedUserOrigin = localStorage.getItem("userOrigin");

    if (!savedUserOrigin) {
        return defaultUserOrigin;
    }

    try {
        return JSON.parse(savedUserOrigin) as UserOriginItem;
    } catch {
        return defaultUserOrigin;
    }
}

const initialState = {
    userOrigin: getInitialUserOrigin(),
};

export const userSelectionSlice = createSlice({
    name:"userSelections",
    initialState,
    reducers :{
     setUserCountry: (state,action:PayloadAction<UserOriginItem>) => {
        state.userOrigin = action.payload;
        localStorage.setItem("userOrigin", JSON.stringify(action.payload));
     }
    }
})

export default userSelectionSlice.reducer
export const { setUserCountry } = userSelectionSlice.actions