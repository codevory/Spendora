import { useState } from 'react'
import toast from 'react-hot-toast'
import LoginComponent from '../components/LoginComponent'
import Layout from '../components/Layout'
import { auth, db } from '../backend/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { handleGoogleSignin } from '../utils/authService';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import {collection } from 'firebase/firestore'
import { getDocs} from 'firebase/firestore'


interface SigninPropsType {
    isOpen:boolean;
    onToggle:() => void;
}
export let isLoggedin = false;
const Signin = ({isOpen,onToggle}:SigninPropsType) => {
        const [password,setPassword] = useState<string>('')
        const [email,setEmail] = useState<string>('')
        const [isLoged, setIsLoged] = useState<boolean>(false)
        const [isLoading,setIsLoading] = useState(false)

        const navigate = useNavigate()
        const success = (message:string) => toast.success(message);
        const fail = (message:string) => toast.error(message);

     async  function handleSignin(e:React.SubmitEvent<HTMLFormElement>){
          setIsLoading(true)
            e.preventDefault()
             await  signInWithEmailAndPassword(auth,email,password)
               .then((usr) => {
                success("🎉signin successfull")
                querySnapshot()
                console.log(usr)
                querySnapshot
                setIsLoged(true)
                const timer = setTimeout(() => {
                    navigate('/signup')
                }, 1500);
                return () => clearTimeout(timer)
            })
               .catch((error) => {
                if(error instanceof Error){
                    console.error(error)
                    fail(error.message)
                }
               }).finally(() => {
                   setEmail('')
                   setPassword('')
                   setIsLoading(false)
               })

        }


        isLoggedin = isLoged
  return (
     <Layout isOpen={isOpen} onToggle={onToggle} isLoggedin={isLoged}>
    {isLoading && <Loader />}
    <div className='max-w-dvw h-dvh flex justify-center items-center p-2 bg-main'>
       <LoginComponent 
            email={email} 
            password={password} 
            setEmail={setEmail} 
            setPassword={setPassword} 
            handleFormSubmit={handleSignin}
            handleGoogleSign={async () => {
              setIsLoading(true);
              try {
                await handleGoogleSignin();
                setIsLoged(true);
              } finally {
                setIsLoading(false);
              }
            }}
            /> 
    </div>
    </Layout>
  )
}

export default Signin
 export async function querySnapshot(){
 const res = await getDocs(collection(db,'users'));
 res.forEach((doc) => {
    console.log(doc.data());
 })
 } 