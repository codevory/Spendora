import ThemeSwitcher from "./ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import ProfileComponent from "./ProfileComponent";
import { getFirebaseServices } from "../backend/firebaseLazy";
import type { Auth } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserData } from "../backend/getUserData";
import {
  setLoginStatus,
  setUserData,
} from "../store/features/userAuthenication";
import DisplayUserOrigin from "./DisplayUserOrigin";
import useThemeContext from "../Hooks/useThemeContext";
interface NavbarPropsType {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarPropsType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState<string>("Guest");
  const [photoURL, setPhotoURL] = useState<string>("/default-man.webp");
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [auth, setFirebaseAuth] = useState<Auth | null>(null);
  const isLoggedin = useAppSelector((state) => state.userData.isLoggedin);
  const { isDark } = useThemeContext()
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    getFirebaseServices().then(({ auth: firebaseAuth }) => {
      setFirebaseAuth(firebaseAuth);
      unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setHasSession(Boolean(user));
        setDisplayName(
          user?.displayName || user?.email?.split("@")[0] || "Guest",
        );
        setPhotoURL(user?.photoURL ?? "/default-man.webp");

        if (user) {
          void getUserData(dispatch);
        } else {
          dispatch(setLoginStatus(false));
          dispatch(setUserData(null));
        }
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isAuthenticated = useMemo(
    () => hasSession || isLoggedin,
    [hasSession, isLoggedin],
  );

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } finally {
      dispatch(setLoginStatus(false));
      dispatch(setUserData(null));
      navigate("/signin");
    }
  };

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
            <img src={`${isDark ? '/menu-light.svg' : '/menu-dark.svg'}`} alt="menu" />
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
                onClick={handleLogout}
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
