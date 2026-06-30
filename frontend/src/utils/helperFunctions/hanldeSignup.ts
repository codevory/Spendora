import toast from "react-hot-toast";
import { Backend_Url } from "../../store/features/transaction";

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

interface handleSignupProps {
  e: React.SubmitEvent<HTMLFormElement>;
  setIsLoading: (val: boolean) => void;
  setPassword:(val:string) => void;
  setUsername:(val:string) => void;
  navigate: (val: string) => void;
  email: string;
  password: string;
  username: string;
  fullName:string;
  currency:string;
  setErrorMessage:(val:string) => void;
  setIsSubmitting:(val:boolean) => void
}

export async function handleSignupWithEmailPassword({
  e,
  fullName,
  username,
  currency,
  email,
  password,
  setIsLoading,
  setErrorMessage,
  setIsSubmitting
}: handleSignupProps) {
  setIsLoading(true);
  e.preventDefault();
  try {
    setIsSubmitting(true)
    setErrorMessage("")
   const resp = await fetch(`${Backend_Url}/api/auth/register`,{
    method:"POST",
    credentials:'include',
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({fullName,username,email,password,currency})
   })
   const data = await resp.json()
   if(resp.ok){
      success("Registered successfully🎉")
      console.log(data)
      setIsLoading(false);
    }
    else{
      setErrorMessage(data.error)
      fail("failed to register,kindly try again")
      setIsLoading(false);
    }
    setIsLoading(false);
  } catch (err) {
    console.error(err)
    fail("Failed to Register,kindly try again")
    setIsLoading(false);
  } finally{
      setIsLoading(false)
      setIsSubmitting(false)
    };
}

