import { useEffect, useRef } from "react"

interface DebounceProps<T extends (args :any[]) => any> {
    func:T
    delay:number
}

export function useDebounce<T extends (...args:any[]) => any>({func,delay}:DebounceProps<T>){
const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

const funcRef = useRef(func)
funcRef.current = func

useEffect(() => {
return () => {
    if(timeRef.current){
        clearTimeout(timeRef.current)
    }
}
},[])


return function(...args:Parameters<T>){
   if(timeRef.current){
    clearTimeout(timeRef.current)
   }

    timeRef.current = setTimeout(() => {
        funcRef.current(...args)
    },delay)
}
}