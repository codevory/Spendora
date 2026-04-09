import { IoMoon, IoSunny } from 'react-icons/io5'
import useThemeContext from '../Hooks/useThemeContext'

const ThemeSwitcher = () => {
    const { isDark, toggleTheme } = useThemeContext()

  return (
    <button
      type='button'
      role='switch'
      aria-checked={!isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`glass flex h-8 w-17 items-center rounded-full px-1 transition-colors active:scale-95 ${isDark ? 'justify-end bg-slate-900/60' : 'justify-start bg-yellow-100/60'}`}
    >
      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-yellow-500 text-slate-900'}`}>
        {isDark ? <IoMoon size={13} /> : <IoSunny size={13} />}
      </span>
    </button>
  )
}

export default ThemeSwitcher
