import {
  setLoginStatus,
  setUserData,
  setError,
  setCsrf,
} from "../store/features/userAuthenication";
import { Backend_Url } from "../store/features/transactionApi";
import type { Dispatch } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store/store";

interface HandleAuthProps {
  dispatch: AppDispatch;
  navigate: (path: string) => void;
  setLoginStatus: typeof setLoginStatus;
  setUserData: typeof setUserData;
  setError: typeof setError;
}

export async function handleDeleteAccount({
  dispatch,
  setError,
  setLoginStatus,
}: HandleAuthProps) {
dispatch(setError({
  message:"Account deletion coming soon!",
  code:500
}))
dispatch(setLoginStatus(true))
}

export async function getCsrf(dispatch:Dispatch) {
  try {
    const data = await fetch(`${Backend_Url}/api/v1/auth/csrf`, {
      credentials:"include"
    })
    if(!data.ok){
      console.log("no-csrf-cookie-found-server")
    }

    const token = await data.json()
    const csrf = token.csrf
    dispatch(setCsrf(csrf))
  } catch (error) {
    console.error("internal server error")
  }
}