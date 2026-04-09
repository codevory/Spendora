import { BiLock, BiUser } from 'react-icons/bi'
import { Link } from 'react-router-dom';

interface LoginComponentPropsType {
    email:string;
    setEmail:(val:string) => void;
    password:string;
    setPassword:(val:string) => void;
    handleFormSubmit:(e:React.SubmitEvent<HTMLFormElement>) => void;
    handleGoogleSign:() => void;
}
const LoginComponent = ({email,setEmail,password,setPassword,handleFormSubmit,handleGoogleSign}:LoginComponentPropsType) => {

  return (
    <div className='card login-card'>
        <form onSubmit={(e) => handleFormSubmit(e)} className='flex flex-col gap-5 w-sm h-[58%] relative'>
         <div className='flex flex-col gap-3'>
            <div>
                <label className='text-muted' htmlFor='username'>email</label>
                <div className='relative input flex gap-1 items-center'>
                    <input className='input-box' id='username' minLength={6} placeholder='John@xyz.com' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <p className='absolute bottom-4 left-1 '>{<BiUser size={22}/> }</p>
                </div>
            </div>
           
            <div>
                <label className='text-muted' htmlFor='password'>password</label>
                <div className='relative input input-feld'>
                  <input className='input-box ' id='password' minLength={8} type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                  <p className='absolute bottom-3 left-1 '>{<BiLock size={22}/> }</p>
                </div>
            </div>
         </div>
            <button className='btn-primary' type='submit'>Signin</button>
            <Link to='/signup' className='absolute top-[98%] right-1  w-23 h-auto items-center rounded-md login-btn '>Signup</Link>
        </form>
        <span className=' h-8 my-2 w-full text-center font-bold text-white '>OR</span>
        <div className='w-full h-[38%] flex flex-col'>
            <div className=' flex-col input-field'>
               <button onClick={() => handleGoogleSign()} className='input google-login login-btn'>signin with Google</button>
               <span className='input facebook-login login-btn'>Login with Facebook</span>
            </div>

        </div>
    


    </div>
  )
}

export default LoginComponent
