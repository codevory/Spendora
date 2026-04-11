import type { ReactNode } from "react";
import Navbar from "./Navbar";
import SidebarMenu from "./SidebarMenu";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isLoggedin: boolean;
}
const Layout = ({ children, onToggle, isOpen, isLoggedin }: LayoutProps) => {
  return (
    <div className="flex flex-col ">
      <div className="navbar">
        <Navbar onToggle={onToggle} isLoggedin={isLoggedin} />
      </div>
      <div className="flex ">
        <div
          className={` ${isOpen ? "w-[14%] transform-content" : "w-[6%] transform-content -transate-x-20"} sidebar bg-green-900`}
        >
          <SidebarMenu isOpen={isOpen} />
        </div>
        <div className="max-w-dvw w-full">{children}</div>
      </div>
      <div className="block md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
};

export default Layout;
