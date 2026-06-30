import { Backend_Url } from "../../store/features/transaction";

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

    const user = await res.json()
    if(user.isGuest){
        return null;
    }

    return user

    } catch (error) {
        console.error("Auth check failed ",error)
        return null
    }
}