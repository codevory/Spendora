import useThemeContext from "../Hooks/useThemeContext";

const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className={`glass flex h-8 w-17 items-center rounded-full px-1 transition-colors active:scale-95 ${isDark ? "justify-end bg-slate-800/70" : "justify-start bg-slate-200/90"}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all `}
      >
        {isDark ? <img src='/sun.svg' width={24} height={24} /> : <img src="/moon-dark.svg" width={24} height={24}/>}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
