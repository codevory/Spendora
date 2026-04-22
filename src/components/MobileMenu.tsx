import { NavLink } from "react-router-dom";
import useThemeContext from "../Hooks/useThemeContext";

const mobileNavItems = [
  {
    to: "/",
    label: "Home",
    srcLight: "/home-light.svg",
    srcDark: "/home-dark.svg",
    alt: "home",
  },
  {
    to: "/analytics",
    label: "Analytics",
    srcLight: "/analytics-light.svg",
    srcDark: "/analytics-dark.svg",
    alt: "analytics",
  },
  {
    to: "/transactions",
    label: "Txns",
    srcLight: "/transaction-light.svg",
    srcDark: "/transaction-dark.svg",
    alt: "transaction",
  },
  {
    to: "/categories",
    label: "Categories",
    srcLight: "/category-light.svg",
    srcDark: "/category-dark.svg",
    alt: "category",
  },
  {
    to: "/me",
    label: "Profile",
    srcLight: "/profile-circle-light.svg",
    srcDark: "/profile-circle-dark.svg",
    alt: "profile",
  },
] as const;

const MobileMenu = () => {
  const { isDark } = useThemeContext();
  return (
    <div className="mobile-menu">
      {mobileNavItems.map((item) => {
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mobile-menu-items ${isActive ? "mobile-menu-items-active" : ""}`
            }
          >
            <img
              src={`${isDark ? item.srcLight : item.srcDark}`}
              alt={item.alt}
              width={22}
              height={22}
            />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileMenu;
