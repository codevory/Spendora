import { useState } from 'react'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import SignupComponent from '../components/SignupComponent';
import { auth, db} from '../backend/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { isLoggedin } from './Signin';
import Loader from '../components/Loader';
import { handleGoogleSignin } from '../utils/authService'
import {addDoc,collection } from 'firebase/firestore'


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
            addData({username:username,email:email})
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
        console.log(userData)
    }

  handleGoogleSignin
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
            handleSignupGoogle={async () => {
              try {
                setIsLoading(true)
                await handleGoogleSignin()
              } finally{
                setIsLoading(false)
              }
            }}
            />
    </div>
    </Layout>
  )
}

export default Signup

interface dataProps {
    username:string;
    email:string;
}
async function addData({username,email}:dataProps){
try {
  const docRef = await addDoc(collection(db,'users'),{
  name:username,
  email : email
  })
console.log("doc written : ",docRef.id)

} catch (error) {
    console.error(error)
}
}