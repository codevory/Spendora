import { NavLink } from "react-router-dom";
import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    name:'dashboard'
  },
  {
    to: "/analytics",
    label: "Analytics",
    name:'analytics'
  },
  {
    to: "/transactions",
    label: "Transactions",
    name:"transactions"
  },
  {
    to: "/categories",
    label: "Categories",
    name:"categoriesTag"
  },
  {
    to:'/me',
    label:"profile",
    name:"profile"
  }
] as const;

const SidebarMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { isDark } = useThemeContext();
  return (
    <div className="sidebar flex h-full flex-col gap-3 py-3">
      {navItems.map((item) => {
        return (
          <NavLink
          prefetch="intent"
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `sidebar-item ${isOpen ? "" : "justify-center"} ${isActive ? "sidebar-item-active shadow-lg shadow-indigo-950/50" : ""}`
            }
          >
           <NavIcon name={item.name} isDarkMode={isDark} size={26} />
            {isOpen ? (
              <span className="text-sm md:font-medium lg:font-semibold">
                {item.label}
              </span>
            ) : null}
          </NavLink>
        );
      })}

      <div
        className={`mt-2 rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 ${isOpen ? "" : "hidden"}`}
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
          Coming soon
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
          <NavIcon name="settings" isDarkMode={isDark} />
          <span>Budgets and settings</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
