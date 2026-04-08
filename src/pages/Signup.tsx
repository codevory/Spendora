import { useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import SignupComponent from '../components/SignupComponent';
import { auth } from '../backend/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth/web-extension';
import { useNavigate } from 'react-router-dom';
import { isLoggedin } from './Signin';
import Loader from '../components/Loader';


interface SignupPropsType {
    isOpen:boolean;
    onToggle:() => void;
}

interface userDataType{
    name:string | null,
    email:string | null
}

const Signup = ({isOpen,onToggle}:SignupPropsType) => {
          const [username,setUsername] = useState<string>('')
          const [password,setPassword] = useState<string>('')
          const [email,setEmail] = useState<string>('')
          const [userData,setUserdata] = useState<userDataType>({name:'',email:''})
          const [isLoading,setIsLoading] = useState(false)

   const navigate = useNavigate()
        const success = (message:string) => toast.success(message);
        const fail = (message:string) => toast.error(message);

       async function handleSignup(e:React.SubmitEvent<HTMLFormElement>){
         setIsLoading(true)
        e.preventDefault();
          await createUserWithEmailAndPassword(auth,email,password)
           .then((userCredentials) => {
            const data = {
                name:userCredentials.user.displayName,
                email:userCredentials.user.email 
            }
            setUserdata(data)
            console.log(data)
            success("🎉signup successfull")
            const timer = setTimeout(() => {
              navigate('/signin')
            }, 1000);
            return () => clearTimeout(timer)
        }).catch((err) => {
          if(err instanceof Error){
            console.error(err)
            fail(err.message)
          }
          fail("Failed to signup")
        }).finally(() => {
          setPassword('')
          setUsername('')
          setIsLoading(false)
        })
    }

  return (
     <Layout isOpen={isOpen} onToggle={onToggle} isLoggedin={isLoggedin}>
    {isLoading && <Loader />}
    <div className='max-w-dvw h-dvh flex justify-center items-center p-2 bg-main'>
         <SignupComponent 
            username={username} 
            setUsername={setUsername}
            password={password} 
            setPassword={setPassword}
            email={email} 
            setEmail={setEmail}
            handleFormSubmit={handleSignup}
            isLoading={isLoading}
            
            />
    </div>
    </Layout>
  )
}

export default Signup
