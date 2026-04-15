import { IoMoon, IoSunny } from "react-icons/io5";
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
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all ${isDark ? "bg-slate-950 text-slate-100" : "bg-amber-500 text-slate-950"}`}
      >
        {isDark ? <IoMoon size={13} /> : <IoSunny size={13} />}
      </span>
    </button>
  );
};

export default ThemeSwitcher;
