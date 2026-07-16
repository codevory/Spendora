import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userDataType {
  fullName: string;
  email: string;
  image?: string;
  username:string;
  currency:string;
  created_at :string;
  name:string;
}

function getStoredUserData(): userDataType | null {
  try {
    const stored = localStorage.getItem("userData");
    if (!stored || stored === "null") {
      return null;
    }
    return JSON.parse(stored) as userDataType;
  } catch {
    return null;
  }
}

interface initialStateType {
  user: userDataType | null;
  isLoading: boolean;
  error: { message: string; code: number } | null;
  isLoggedin: boolean;
}
const storedUserData = getStoredUserData();
const initialState: initialStateType = {
  user: storedUserData,
  isLoggedin: Boolean(storedUserData?.email),
  error: null,
  isLoading: false,
};

const userAuth = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<userDataType | null>,
    ) => {
      state.user = action.payload
      localStorage.setItem("userData",JSON.stringify(action.payload))
    },
    setLoginStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoggedin = action.payload;
      localStorage.setItem("isLoggedin", JSON.stringify(state.isLoggedin));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<initialStateType["error"]>) => {
      state.error = action.payload;
    },
  },
});

export default userAuth.reducer;
export const { setUserData, setLoginStatus, setError, setLoading } =
  userAuth.actions;
