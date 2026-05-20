import { Link } from "react-router-dom";
import { LockOutlineIcon, UserOutlineIcon } from "./icons/LocalIcons";

interface LoginComponentPropsType {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleFormSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  handleGoogleSign: () => void;
}
const LoginComponent = ({
  email,
  setEmail,
  password,
  setPassword,
  handleFormSubmit,
  handleGoogleSign,
}: LoginComponentPropsType) => {
  return (
    <div className="auth-card ">
      <form onSubmit={handleFormSubmit} className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-muted"
              htmlFor="username"
            >
              email
            </label>
            <div className="input auth-field flex items-center gap-1 rounded-xl px-4 py-3">
              <p className="auth-icon">{<UserOutlineIcon size={22} />}</p>
              <input
                className="w-full bg-transparent py-1 pl-10 outline-none"
                id="username"
                minLength={6}
                placeholder="John@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-muted"
              htmlFor="password"
            >
              password
            </label>
            <div className="input auth-field flex items-center gap-1 rounded-xl px-4 py-3">
              <p className="auth-icon">{<LockOutlineIcon size={22} />}</p>
              <input
                className="w-full bg-transparent py-1 pl-10 outline-none"
                id="password"
                minLength={8}
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <button className="btn-primary" type="submit">
          Signin
        </button>
        <div className="flex justify-end mb-3">
          <Link to="/signup" className="auth-link">
            Signup
          </Link>
        </div>
      </form>

      <div className="flex w-full flex-col gap-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoogleSign}
            className="auth-social-button bg-linear-to-br from-blue-600 to-red-500 from-25% to-55%"
          >
            continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
