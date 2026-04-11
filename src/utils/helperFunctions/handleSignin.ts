import { auth, db } from '../../backend/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import toast from 'react-hot-toast'
import {collection,getDocs } from 'firebase/firestore'


     interface hanldeSigninWithPasswordProps{
        setIsLoading:(val:boolean) => void;
        setEmail:(val:string) => void;
        setPassword:(val:string) => void;
        email:string;
        password:string;
        setIsLoged:(val:boolean) => void;
        e:React.SubmitEvent<HTMLFormElement>;
        navigate:(val:string) => void;

     }

        const success = (message:string) => toast.success(message);
        const fail = (message:string) => toast.error(message);
     
     export async function handleSigninWithPassword({
        e,
        navigate,
        setEmail,
        setIsLoading,
        setPassword,
        email,
        password,
        setIsLoged}:hanldeSigninWithPasswordProps){
          setIsLoading(true)
            e.preventDefault()
             await  signInWithEmailAndPassword(auth,email,password)
               .then((usr) => {
                success("🎉signin successfull")
                console.log(usr)
                setIsLoged(true)
                const timer = setTimeout(() => {
                    navigate('/')
                }, 1000);
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


         export async function querySnapshot(){
         const res = await getDocs(collection(db,'users'));
         res.forEach((doc) => {
            console.log(doc.data());
         })
         } 