import { getFirebaseServices } from "../../backend/firebaseLazy";
import toast from "react-hot-toast";
import { collection, getDocs } from "firebase/firestore/lite";
import { Backend_Url } from "../../store/features/transaction";

interface hanldeSigninWithPasswordProps {
  setIsLoading: (val: boolean) => void;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  email: string;
  password: string;
  setIsLoged: (val: boolean) => void;
  e: React.SubmitEvent<HTMLFormElement>;
  navigate: (val: string) => void;
}


const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

export async function handleSigninWithPassword({
  e,
  navigate,
  setEmail,
  setIsLoading,
  setPassword,
  email,
  password,
  setIsLoged,
}: hanldeSigninWithPasswordProps) {
  setIsLoading(true);
  e.preventDefault();
 
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
      setIsLoged(true)
      setIsLoading(false)
      console.log(user)
      navigate("/")
      return;
    }
    else{
        setIsLoged(false)
        setIsLoading(false)
       return fail(user.error)
      }
  } catch (err) {
    if(err instanceof Error){
      fail(err.message)
    }
    console.error("Failed to login",err) 
    setIsLoading(false)
  }finally{
    setEmail("")
    setPassword("")
  }
}

export async function querySnapshot() {
  const { db } = await getFirebaseServices();
  const res = await getDocs(collection(db, "users"));
  res.forEach((doc) => {
    console.log(doc.data());
  });
}
