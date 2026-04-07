import { useState,useEffect } from 'react'
import useThemeContext from '../Hooks/useThemeContext'

const ThemeSwitcher = () => {
    const [isDark,setIsDark] = useState<boolean>(false)
    const useTheme = useThemeContext()
    useEffect(() => {
        const newTheme = useTheme.context.defaultValue;
        newTheme === "dark" ? setIsDark(true) : setIsDark(false)
    },[])
    function handleClick(){
      setIsDark((p) => !p)
    }
  return (
    <div className={`glass w-17 h-8 flex items-center transition-colors ${isDark ? "justify-end" : "justify-start"}`} >
      <button onClick={() => handleClick()} className={`active:scale-95 cursor-pointer transition-transform w-7 h-7 rounded-full ${isDark ? 'bg-black' : 'bg-yellow-600'}`}></button>
    </div>
  )
}

export default ThemeSwitcher
