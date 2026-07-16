import toast from "react-hot-toast";
import { Backend_Url } from "../../store/features/transactionApi";
import type { Dispatch } from "@reduxjs/toolkit";
import { setLoginStatus, setUserData} from "../../store/features/userAuthenication";

interface hanldeSigninWithPasswordProps {
  setIsLoading: (val: boolean) => void;
  setPassword: (val: string) => void;
  email: string;
  password: string;
  e: React.SubmitEvent<HTMLFormElement>;
  navigate: (val: string) => void;
  setIsSubmitting:(val:boolean) => void
  dispatch:Dispatch
}


const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

export async function handleSigninWithPassword({
  e,
  setIsLoading,
  setPassword,
  email,
  password,
  setIsSubmitting,
  dispatch,
}: hanldeSigninWithPasswordProps) {
  setIsLoading(true);
  e.preventDefault();
 
  setIsSubmitting(true)
  try {
    const res = await fetch(`${Backend_Url}/api/auth/login`,{
      method:"POST",
      credentials:'include',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    })

    const user = await res.json()
    if(res.ok){
      success("Logged in successfully🎉")

      const userData = {
        fullName:user.fullName,
        email:user.email,
        username:user.username,
        currency:user.currency,
        created_at:user.created_at,
        name:user.fullName ?? user.username,
        image:undefined
      }
      localStorage.setItem("userData",JSON.stringify(userData))
      dispatch(setUserData(userData))
      dispatch(setLoginStatus(true))
      setIsLoading(false)
      return userData;
    }
    else{
        setIsLoading(false)
       return fail(user.error)
      }
  } catch (err) {
    if(err instanceof Error){
      fail(err.message)
    }
    console.error("Failed to login",err) 
    fail("Internal server error to login")
    setIsLoading(false)
  }finally{
    setPassword("")
    setIsSubmitting(false)
  }
}