import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'spendora-theme'
const THEME_EVENT = 'spendora-theme-change'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'dark'
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.classList.toggle('theme-light', theme === 'light')
    root.classList.toggle('theme-dark', theme === 'dark')
    root.style.colorScheme = theme
}

const useThemeContext = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        applyTheme(theme)
        localStorage.setItem(STORAGE_KEY, theme)
        window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }))
    }, [theme])

    useEffect(() => {
        const syncTheme = (event: Event) => {
            const custom = event as CustomEvent<Theme>
            if (custom.detail === 'dark' || custom.detail === 'light') {
                setTheme(custom.detail)
            }
        }

        window.addEventListener(THEME_EVENT, syncTheme)
        return () => {
            window.removeEventListener(THEME_EVENT, syncTheme)
        }
    }, [])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    return {
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme,
    }
}

export default useThemeContext
