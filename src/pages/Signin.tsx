import React,{ useState,Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleGoogleSignin } from '../utils/authService';
import Loader from '../components/Loader';
import { handleSigninWithPassword } from '../utils/helperFunctions/handleSignin'

interface SigninPropsType {
  isOpen:boolean;
  onToggle:() => void;
}


export let isLoggedin = false;
const Signin = ({isOpen,onToggle}:SigninPropsType) => {
const LoginComponent = React.lazy(() => import('../components/LoginComponent'))
const Layout = React.lazy(() => import('../components/Layout'))
        const [password,setPassword] = useState<string>('')
        const [email,setEmail] = useState<string>('')
        const [isLoged, setIsLoged] = useState<boolean>(false)
        const [isLoading,setIsLoading] = useState(false)
        const navigate = useNavigate()

        isLoggedin = isLoged
  return (
    <Suspense fallback={<Loader />}>
     <Layout isOpen={isOpen} onToggle={onToggle} isLoggedin={isLoged}>
    {isLoading && <Loader />}
    <div className='max-w-dvw h-dvh flex justify-center items-center p-2 bg-main'>
       <LoginComponent 
            email={email} 
            password={password} 
            setEmail={setEmail} 
            setPassword={setPassword} 
            handleFormSubmit={(e) => handleSigninWithPassword({navigate:navigate,email:email,e:e,setEmail:setEmail,setIsLoading:setIsLoading,setIsLoged:setIsLoged,setPassword:setPassword,password:password})}
            handleGoogleSign={() => handleGoogleSignin({setIsLoading:setIsLoading,isLoged:isLoged})}
            /> 
    </div>
    </Layout>
    </Suspense>
  )
}

export default Signin
