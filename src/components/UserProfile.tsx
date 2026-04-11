import ThemeSwitcher from "./ThemeSwitcher";

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
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 items-center">
          <img
            src={image || "/girl1.png"}
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

      <div className="mt-5 flex flex-col gap-2">
        <ThemeSwitcher />
        <button
          type="button"
          onClick={onLogout}
          className="h-10 rounded-lg bg-slate-900 text-slate-100 font-semibold cursor-pointer transition hover:bg-slate-700 active:scale-95"
        >
          Logout
        </button>
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
