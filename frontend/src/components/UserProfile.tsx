import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { getUserOriginList } from "../utils/currency";
import { setUserCountry } from "../store/features/userSelections";

interface UserProfileProps {
  name: string;
  age?: number;
  email: string;
  image?: string;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

const UserProfile = ({
  name,
  age,
  email,
  image,
  onLogout,
  onDeleteAccount,
}: UserProfileProps) => {
  const dispatch = useAppDispatch();
  const userStatus = localStorage.getItem("isLoggedin");
  const status = JSON.parse(userStatus !== null ? userStatus : "");
  const isAuthenticated = useMemo(() => {
    return Boolean(status);
  }, [status]);

  const userOriginDetails = useAppSelector((state) => state.origin.userOrigin);
  const userOrigins = getUserOriginList();
  const [userKey, setUserKey] = useState(userOriginDetails.key);

  useEffect(() => {
    setUserKey(userOriginDetails.key);
  }, [userOriginDetails.key]);

  function onSubmitForm(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedOne = userOrigins.find((u) => u.key === userKey);

    if (selectedOne) {
      dispatch(setUserCountry(selectedOne));
    }
  }

  return (
    <div className="card glass p-5 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={image}
            alt={name}
            width={78}
            height={78}
            className="h-20 w-20 rounded-2xl border border-slate-600 object-cover"
          />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-slate-100">{name}</h2>
            <p className="text-sm text-slate-400">{email}</p>
            {typeof age === "number" && age > 0 ? (
              <p className="text-sm text-slate-300">Age: {age}</p>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
          Active account
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <form onSubmit={onSubmitForm} className="form flex items-center gap-3">
          <select
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            className="outline-none bg-slate-800"
          >
            {userOrigins.map((u) => (
              <option key={u.key} value={u.key}>
                {u.key}
              </option>
            ))}
          </select>
          <span>{userOriginDetails.currencySymbol}</span>
          <button className="form-button">Change</button>
        </form>
        <ThemeSwitcher />
        {isAuthenticated ? (
          <button
            type="button"
            onClick={onLogout}
            className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm font-semibold text-slate-100 transition hover:bg-slate-700 active:scale-95"
          >
            Logout
          </button>
        ) : (
          <Link prefetch="intent"
            to="/signin"
            className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-500 flex items-center justify-center active:scale-95"
          >
            Login / Regiser
          </Link>
        )}
        <button
          type="button"
          onClick={onDeleteAccount}
          className="h-10 rounded-lg bg-rose-500/20 text-rose-300 font-semibold cursor-pointer transition hover:bg-rose-500/30 active:scale-95"
        >
          Delete account
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
