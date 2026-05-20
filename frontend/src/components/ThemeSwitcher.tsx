import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";
const ThemeSwitcher = () => {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      style={{
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  }}
      className={`h-6 w-12 items-center transition-all `}
    >
        {isDark ? (
         <NavIcon name="moon" isDarkMode={isDark} />
        ) : (
          <NavIcon name="sun" isDarkMode={isDark}  />
        )}
  
    </button>
  );
};

export default ThemeSwitcher;
