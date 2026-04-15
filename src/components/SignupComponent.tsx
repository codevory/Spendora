import React from "react";
import { BiLock, BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import Loader from "./Loader";

interface SignupomponentPropsType {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  handleFormSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  handleSignupGoogle: () => void;
}

const SignupComponent = ({
  isLoading,
  handleSignupGoogle,
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  handleFormSubmit,
}: SignupomponentPropsType) => {
  return (
    <div className="card login-card min-h-135">
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="flex flex-col gap-5 w-sm h-[70%] relative"
      >
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-muted" htmlFor="username">
              username
            </label>
            <div className="relative input flex gap-1 items-center">
              <input
                className="input-box"
                id="username"
                minLength={6}
                placeholder="John"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="absolute bottom-4 left-1 ">
                {<BiUser size={22} />}
              </p>
            </div>
          </div>

          <div>
            <label className="text-muted" htmlFor="password">
              password
            </label>
            <div className="relative input input-feld">
              <input
                className="input-box "
                id="password"
                minLength={8}
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="absolute bottom-3 left-1 ">
                {<BiLock size={22} />}
              </p>
            </div>
          </div>

          <div>
            <label className="text-muted" htmlFor="email">
              email
            </label>
            <div className="relative input input-feld">
              <input
                className="input-box "
                id="email"
                minLength={12}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="absolute bottom-3 left-1 ">
                {<BiLock size={22} />}
              </p>
            </div>
          </div>
        </div>
        <button className="btn-primary" type="submit">
          {isLoading ? <Loader /> : "Signup"}
        </button>
        <Link
          to="/signin"
          className="absolute top-1/1 right-0  w-23 h-auto items-center rounded-md login-btn "
        >
          sign in
        </Link>
      </form>
      <span className=" h-8 my-2 w-full text-center font-bold text-slate-200 ">
        OR
      </span>
      <div className="w-full h-[30%] flex flex-col">
        <div className=" flex-col input-field">
          <button
            onClick={() => handleSignupGoogle}
            className="input google-login login-btn"
          >
            Signup with Google
          </button>
          <span className="input facebook-login login-btn">
            Signup with Facebook
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
