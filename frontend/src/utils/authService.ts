import toast from "react-hot-toast";
import type { AppDispatch } from "../store/store";
import {
  setLoginStatus,
  setUserData,
  setError,
} from "../store/features/userAuthenication";
import { Backend_Url } from "../store/features/transaction";

interface HandleAuthProps {
  dispatch: AppDispatch;
  navigate: (path: string) => void;
  setLoginStatus: typeof setLoginStatus;
  setUserData: typeof setUserData;
  setError: typeof setError;
}
// interface handleGoogleSigninProps {
//   setIsLoading: (val: boolean) => void;
//   deps?: {
//     getFirebaseServices?: () => Promise<any>;
//     signInWithPopup?: (...args: any[]) => Promise<any>;
//     credentialFromResult?: (...args: any[]) => any;
//     credentialFromError?: (...args: any[]) => any;
//     success?: (...args: any[]) => any;
//     fail?: (...args: any[]) => any;
//   };
// }

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);


export async function handleLogout({
  dispatch,
  setLoginStatus,
  setUserData,
  navigate
}: HandleAuthProps) {

  try{
    const resp = fetch(`${Backend_Url}/api/auth/logout`,{
      credentials:'include'
    })
    
    if(!(await resp).ok){
      fail("server responded with an error status")
      throw new Error("server responded with an error status ")
    }

    (await resp).json()
      dispatch(setLoginStatus(false));
      dispatch(setUserData(null));
      success("logout successfull 🫤")
      navigate("/welcome")
  }
    catch(err) {
      fail("Failed to logout, server error")
      console.error(err)
    }

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
