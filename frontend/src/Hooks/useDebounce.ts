import { useEffect, useRef,useCallback } from "react"

interface DebounceProps<T extends (...args :any[]) => any> {
    func:T
    delay:number
}

export function useDebounce<T extends (...args:any[]) => any>({func,delay}:DebounceProps<T>){
const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

const funcRef = useRef<T>(func)

useEffect(() => {
    funcRef.current = func
},[func])

useEffect(() => { //cleanup timer
return () => {
    if(timeRef.current){
        clearTimeout(timeRef.current)
    }
}
},[delay])


return useCallback((...args:Parameters<T>)=> {
  if(timeRef.current){
    clearTimeout(timeRef.current)
  }

  timeRef.current = setTimeout(() => {
    funcRef.current(...args)
  },delay)
},[delay])
}