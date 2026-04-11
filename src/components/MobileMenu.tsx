import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { GrTransaction } from "react-icons/gr";
import { IoHome } from "react-icons/io5";
import { SiGoogleanalytics } from "react-icons/si";
import { LuTags } from "react-icons/lu";

const mobileNavItems = [
  { to: "/", label: "Home", icon: IoHome },
  { to: "/analytics", label: "Analytics", icon: SiGoogleanalytics },
  { to: "/transactions", label: "Transactions", icon: GrTransaction },
  { to: "/categories", label: "Categories", icon: LuTags },
  { to: "/me", label: "Profile", icon: CgProfile },
] as const;

const MobileMenu = () => {


  return (
    <div className="mobile-menu">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `mobile-menu-items ${isActive ? "mobile-menu-items-active" : ""}`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default MobileMenu;
