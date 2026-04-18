import { NavLink } from "react-router-dom";
import useThemeContext from "../Hooks/useThemeContext";

const navItems = [
  { to: "/", label: "Dashboard", srclight: '/dashboard-light1.svg',srcdark:'/dashboard-dark.svg' },
  { to: "/analytics", label: "Analytics", srclight:'/graph2-light.svg', srcdark:'/graph-dark.svg' },
  { to: "/transactions", label: "Transactions", srclight:'/transaction-light.svg',srcdark:'transaction-dark.svg' },
  { to: "/categories", label: "Categories", srclight:'/category-light.svg',srcdark:'/category-dark.svg' },
  { to: "/me", label: "Profile", srclight:'profile-circle-light.svg', srcdark:'profile-circle-dark.svg' },
] as const;

const SidebarMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { isDark } = useThemeContext()
  return (
    <div className="sidebar flex h-full flex-col gap-3 py-3">
      {navItems.map((item) => {
        
        return (
          <NavLink
          key={item.to}
          to={item.to}
          title={item.label}
          className={({ isActive }) =>
            `sidebar-item ${isOpen ? "" : "justify-center"} ${isActive ? "sidebar-item-active shadow-lg shadow-indigo-950/50" : ""}`
        }
        >
            <img src={`${isDark ? item.srclight: item.srcdark}`} width={25} height={25} />
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
          <img src={`${isDark ? '/setting-light.svg' : '/setting-dark.svg'}`} width={25} height={25} />
          <span>Budgets and settings</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
