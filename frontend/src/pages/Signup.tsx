import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { handleGoogleSignin } from "../utils/authService";
import { handleSignupWithEmailPassword } from "../utils/helperFunctions/hanldeSignup";
import SignupComponent from "../components/RegisterForm";
import Layout from "../components/Layout";

interface SignupPropsType {
  isOpen: boolean;
  onToggle: () => void;
}

const Signup = ({ isOpen, onToggle }: SignupPropsType) => {
  const [fullName,setFullName] = useState<string>("")
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [currency,setCurrency] = useState("inr")
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage,setErrorMessage] = useState<string>('')
  const navigate = useNavigate();
  return (
    <Layout isOpen={isOpen} onToggle={onToggle}>
      {isLoading && <Loader />}
      <div className="auth-page">
        <div className="auth-shell">
          <SignupComponent
           errorMessage={errorMessage}
            fullName={fullName}
            setFullName={setFullName}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            currency={currency}
            setCurrency={setCurrency}
            handleFormSubmit={(e) =>
              handleSignupWithEmailPassword({
                e: e,
                email: email,
                password: password,
                setIsLoading: setIsLoading,
                setPassword: setPassword,
                username: username,
                setUsername: setUsername,
                navigate: navigate,
                fullName:fullName,
                currency:currency,
                setErrorMessage:setErrorMessage
              })
            }
            isLoading={isLoading}
            handleSignupGoogle={() =>
              handleGoogleSignin({
                setIsLoading: setIsLoading,
              })
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
