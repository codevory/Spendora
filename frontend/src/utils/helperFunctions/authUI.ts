import { Backend_Url } from "../../store/features/transactionApi";
import type { userDataType } from "../../store/features/userAuthenication";

export async function checkAuth() {
    try {
      const res = await fetch(`${Backend_Url}/api/auth/me`,{
        method:"GET",
        credentials:'include'
      })

      if(!res.ok){
          console.error("unexpected response",res.status)
          return null
        }

    const user:userDataType | null = await res.json()
    if(!user){
        return null;
    }
 
    return user

    } catch (error) {
        console.error("Auth check failed ",error)
        return null
    }
}