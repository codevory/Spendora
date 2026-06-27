import toast from "react-hot-toast";

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
}

export async function handleSignupWithEmailPassword({
  e,
  fullName,
  username,
  navigate,
  currency,
  email,
  password,
  setIsLoading,
  setErrorMessage
}: handleSignupProps) {
  setIsLoading(true);
  e.preventDefault();
  try {
    setErrorMessage("")
   const resp = await fetch("/api/auth/register",{
    method:"POST",
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
    navigate("/signin")
  } catch (err) {
    console.error(err)
    fail("Failed to Register,kindly try again")
    setIsLoading(false);
  } finally{
      setIsLoading(false)
    };
}

