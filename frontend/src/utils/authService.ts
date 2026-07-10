import type { AppDispatch } from "../store/store";
import {
  setLoginStatus,
  setUserData,
  setError,
} from "../store/features/userAuthenication";

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
