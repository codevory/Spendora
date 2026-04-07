import { createContext } from 'react-router-dom'

const useThemeContext = () => {
    let theme:"dark" | "light" = "dark"; 
        const systemTheme = window.matchMedia('(prefers-color-scheme:dark)')
        systemTheme.addEventListener("change",(e) => {
            const newTheme = e.matches ? "dark" : "light";
            theme = newTheme
        })
    const context = createContext(theme)
  return {context}
}

export default useThemeContext
