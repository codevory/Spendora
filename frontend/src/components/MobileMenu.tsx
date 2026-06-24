import { NavLink } from "react-router-dom";
import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";

const mobileNavItems = [
  {
    to: "/",
    label: "Home",
    name:"home",
    alt: "home",
  },
  {
    to: "/analytics",
    label: "Analytics",
    name:"analytics",
    alt: "analytics",
  },
  {
    to: "/transactions",
    label: "Txns",
    name:"transactions",
    alt: "transaction",
  },
  {
    to: "/categories",
    label: "Categories",
    name:"categoriesTag",
    alt: "category",
  },
  {
    to: "/me",
    label: "Profile",
    name:"profile",
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
          prefetch="intent"
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mobile-menu-items ${isActive ? "mobile-menu-items-active" : ""}`
            }
          >
           <NavIcon name={item.name} isDarkMode={isDark} size={24} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileMenu;
