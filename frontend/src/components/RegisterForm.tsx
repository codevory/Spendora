import React from "react";
import { Link } from "react-router-dom";
import './registerForm.css'

interface SignupomponentPropsType {
  fullName:string;
  setFullName:(val:string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  currency:string,
  setCurrency:(val:string) => void;
  handleFormSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  handleSignupGoogle: () => void;
  errorMessage:string;
}

const SignupComponent = ({
  errorMessage,
  handleSignupGoogle,
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  fullName,
  setFullName,
  currency,
  setCurrency,
  handleFormSubmit,
}: SignupomponentPropsType) => {
  return (
    <div className="auth-card ">
					<form className="auth-form" id="signup-form" method="post" onSubmit={(e) => handleFormSubmit(e)}>
							<div className="field">
								<label htmlFor="full-name">Full name</label>
								<input value={fullName} onChange={(e) => setFullName(e.target.value)} id="full-name" name="firstName" type="text" placeholder="Ariana Dajio"  required />
							</div>

						<div className="field">
							<label htmlFor="register-email">Email address</label>
							<input value={email} onChange={(e) => setEmail(e.target.value)} id="register-email" name="email" type="email" placeholder="name@company.com"  required />
						</div>

              <div className="field">
								<label htmlFor="userName">Username</label>
								<input value={username} onChange={(e) => setUsername(e.target.value)} id="userName" name="userName" type="text" placeholder="Ariana"  required />
							</div>

						<div className="field-row">
							<div className="field">
								<label htmlFor="register-password">Password</label>
								<input value={password} onChange={(e) => setPassword(e.target.value)} id="register-password" name="password" type="password" placeholder="Create a password" required />
							</div>
							<div className="field">
								<label htmlFor="currency">Preferred currency</label>
								<select value={currency} onChange={(e) => setCurrency(e.target.value)} id="currency" name="currency">
									<option value="usd">USD - United States Dollar</option>
									<option value="eur">EUR - Euro</option>
									<option value="gbp">GBP - British Pound</option>
									<option value="inr">INR - Indian Rupee</option>
								</select>
							</div>
						</div>

						<div className="auth-help">
							<span>Already have an account?</span>
              <Link to={'/signin'}>Sign in instead</Link>
						</div>
              <p className="error-message" id="register-form-error-message">{errorMessage}</p>
                <button type="submit"  className="button register-btn">Register</button>
					</form>

      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleSignupGoogle}
            className="auth-social-button bg-linear-to-br from-blue-600 to-red-500 from-25% to-55%"
          >
            continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
