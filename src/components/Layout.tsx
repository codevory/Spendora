import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import SidebarMenu from "./SidebarMenu";

const MobileMenu = lazy(() => import("./MobileMenu"));

interface LayoutProps {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isLoggedin: boolean;
}
const Layout = ({ children, onToggle, isOpen, isLoggedin }: LayoutProps) => {
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
      {isMobile ? (
        <Suspense fallback={null}>
          <MobileMenu />
        </Suspense>
      ) : null}
    </div>
  );
};

export default Layout;
