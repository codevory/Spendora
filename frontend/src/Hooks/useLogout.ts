import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../store/store"
import { transactionApi, useLogoutUserMutation } from "../store/features/transactionApi"
import toast from "react-hot-toast"
import { setLoginStatus, setUserData } from "../store/features/userAuthenication"

export const useLogoutUser = (setIsSubmitting:(val:boolean) => void) => {
    let timer:number | null = null;

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
   const [triggerLogout, { isLoading,isSuccess, isError }] = useLogoutUserMutation()
   const failed = (val:string) => toast.error(val)
   const success = (val:string) => toast.success(val)

   if(timer !== null){
    clearTimeout(timer)
   }

   const handleLogout = async () => {
    setIsSubmitting(true)
    
        timer = setTimeout(async () => {
               await triggerLogout()
               .unwrap()
            .catch((err) => {
                console.error("Backend logout failed, proceeding with client cleanup", err);
                failed("an error occured to logout")
            }).finally(() => {
                dispatch(setUserData(null))
                dispatch(setLoginStatus(false))
                dispatch(transactionApi.util.resetApiState())
                success("logged out Successfull")
                
                navigate("/welcome")
            })
            timer = null
            setIsSubmitting(false)
        }, 900); 

        } 

    return { handleLogout, isLoading, isSuccess, isError}

}