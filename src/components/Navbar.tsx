import { HiOutlineMenu } from "react-icons/hi";
import ThemeSwitcher from "./ThemeSwitcher";
import { Link, useNavigate } from "react-router-dom";
import ProfileComponent from "./ProfileComponent";
import { getFirebaseServices } from "../backend/firebaseLazy";
import type { Auth } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { isLoggedin } from "../pages/Signin";
interface NavbarPropsType {
  onToggle: () => void;
}

const Navbar = ({ onToggle }: NavbarPropsType) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string>("Guest");
  const [photoURL, setPhotoURL] = useState<string>("/default-man.webp");
  const [hasSession, setHasSession] = useState<boolean>(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    getFirebaseServices().then(({ auth: firebaseAuth }) => {
      setAuth(firebaseAuth);
      unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        setHasSession(Boolean(user));
        setDisplayName(
          user?.displayName || user?.email?.split("@")[0] || "Guest",
        );
        setPhotoURL(user?.photoURL || "/default-man.webp");
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
      navigate("/signin");
    }
  };

  return (
    <div className="navbar h-16 border-b border-slate-700/70 px-4 md:px-6">
      <div className="flex h-full items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:bg-slate-800 active:scale-95 md:flex"
            aria-label="Toggle sidebar"
          >
            <HiOutlineMenu size={22} />
          </button>

          <div className="hidden md:block">
            <p className="text-xs tracking-[0.2em] text-slate-500">SPENDORA</p>
            <p className="text-sm font-semibold text-slate-200">
              Personal finance dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <ThemeSwitcher />
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 flex items-center justify-center active:scale-95"
            >
              Login
            </Link>
          )}

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-2 py-1">
            <ProfileComponent
              user={displayName}
              imgSrc={photoURL}
              isLoggedin={isAuthenticated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
