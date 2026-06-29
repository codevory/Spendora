import { Backend_Url } from "../../store/features/transaction";

export async function checkAuth() {
    try {
      const res = await fetch(`${Backend_Url}/api/auth/me`)
      if(!res.ok){
          console.error("unexpected response",res.status)
          return "Guest"
        }
    const user = await res.json()
    if(user.isGuest){
        return false;
    }

    return user
    } catch (error) {
        console.error("Auth check failed ",error)
        return "Guest"
    }
}