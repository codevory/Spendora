import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import SidebarMenu from "./SidebarMenu";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}
const Layout = ({ children, onToggle, isOpen }: LayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  return (
    <div className="flex flex-col ">
      <div className="navbar">
        <Navbar onToggle={onToggle} />
      </div>
      <div className="flex ">
        <div
          className={`${isOpen ? "w-[14%] transform-content" : "w-[6%] transform-content -translate-x-20"} sidebar`}
        >
          <SidebarMenu isOpen={isOpen} />
        </div>
        <div className="max-w-dvw w-full layout">{children}</div>
      </div>
      {isMobile ? <MobileMenu /> : null}
    </div>
  );
};

export default Layout;
