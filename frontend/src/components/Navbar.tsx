import ThemeSwitcher from "./ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import ProfileComponent from "./ProfileComponent";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  setError,
  setLoginStatus,
  setUserData,
} from "../store/features/userAuthenication";
import DisplayUserOrigin from "./DisplayUserOrigin";
import useThemeContext from "../Hooks/useThemeContext";
import { NavIcon } from "./icons/UseIcon";
import { checkAuth } from "../utils/helperFunctions/authUI";
import { handleLogout } from "../utils/authService";
import { useEffect, useMemo,useState } from "react";
interface NavbarPropsType {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarPropsType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState<string>("Guest");
  const [photoURL, setPhotoURL] = useState<string>("/default-man.webp");
  const [hasSession, setHasSession] = useState<boolean>(false);
  const isLoggedin = useAppSelector((state) => state.userData.isLoggedin);
  const { isDark } = useThemeContext();


    const isAuthenticated = useMemo(
    () => hasSession || isLoggedin,
    [hasSession, isLoggedin],
  );

  useEffect(() => {
    (async () => {
      await getUser();
    })();

    setPhotoURL("/default-man.webp");
  }, [isAuthenticated]);


  async function getUser(){
    const user = await checkAuth()
    if(user?.username){
      dispatch(setUserData({name:user.fullName ?? user.username,email:user.email}))
      setHasSession(true)
      dispatch(setLoginStatus(true))
      setDisplayName(user.fullName ?? user.username)
      console.log("logged in")
    }
    else{
      dispatch(setUserData(null))
      setHasSession(false)
      dispatch(setLoginStatus(false))
      setDisplayName("Guest")
      console.log("not loggedin")
    }
   console.log(user)
  }

  return (
    <nav
      className="navbar border-b border-slate-700/70 px-2 py-3 md:px-6"
      aria-label="Top navigation"
    >
      <div className="navbar-shell mx-auto w-full max-w-425 rounded-2xl border border-slate-700/70 bg-linear-to-r from-slate-900/95 via-slate-900/90 to-slate-800/90 px-3 py-2 shadow-xl shadow-slate-950/30 backdrop-blur md:px-4">
        <div className="flex min-h-12 w-full items-center justify-between gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3 md:gap-4">
          <div className="flex min-w-0 items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={onToggle}
              className="navbar-menu-btn hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-600/70 bg-slate-950/60 text-slate-100 transition hover:bg-slate-800 active:scale-95 md:flex"
              aria-label="Toggle sidebar"
            >
              <NavIcon name="menu-toggle" isDarkMode={isDark} />
            </button>

            <div className="min-w-0">
              <p className="navbar-brand-eyebrow text-[10px] font-semibold tracking-[0.28em] text-indigo-200/70 md:text-xs">
                SPENDORA
              </p>
              <p className="navbar-brand-title truncate text-xs font-semibold text-slate-100 sm:block sm:text-sm">
                Personal finance dashboard
              </p>
            </div>
          </div>

          <div className="hidden justify-center sm:flex">
            <DisplayUserOrigin />
          </div>

          <div className="ml-auto flex items-center justify-end gap-2 sm:ml-0 md:gap-3">
            <div className="sm:hidden">
              <DisplayUserOrigin />
            </div>

            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => handleLogout({dispatch:dispatch,setLoginStatus:setLoginStatus,setUserData:setUserData,setError:setError,navigate:navigate})}
                className="navbar-action-btn h-9 rounded-lg border border-slate-600/70 bg-slate-900 px-3 text-xs font-semibold text-slate-100 transition hover:bg-slate-700 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/signin"
                className="flex h-9 items-center justify-center rounded-lg bg-linear-to-r from-indigo-600 to-violet-500 px-3 text-xs font-semibold text-white transition hover:from-indigo-500 hover:to-violet-400 active:scale-95 sm:h-10 sm:px-4 sm:text-sm"
              >
                Login
              </Link>
            )}

            <div className="navbar-profile-wrap rounded-xl border border-slate-600/70 bg-slate-950/65 px-2 py-1">
              <ProfileComponent
                user={displayName}
                imgSrc={photoURL}
                isLoggedin={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
