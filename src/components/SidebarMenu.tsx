import { IoPieChartOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuTags } from "react-icons/lu";
import { RiExchangeDollarLine, RiProfileLine } from "react-icons/ri";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LuLayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: IoPieChartOutline },
  { to: "/transactions", label: "Transactions", icon: RiExchangeDollarLine },
  { to: "/categories", label: "Categories", icon: LuTags },
  { to: "/me", label: "Profile", icon: RiProfileLine },
] as const;

const SidebarMenu = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="sidebar flex h-full flex-col gap-3 py-3">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              `sidebar-item ${isOpen ? "" : "justify-center"} ${isActive ? "sidebar-item-active shadow-lg shadow-indigo-950/50" : ""}`
            }
          >
            <Icon size={20} />
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
          <IoSettingsOutline size={16} />
          <span>Budgets and settings</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;
