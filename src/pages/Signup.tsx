import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { handleGoogleSignin } from "../utils/authService";
import { handleSignupWithEmailPassword } from "../utils/helperFunctions/hanldeSignup";
import SignupComponent from "../components/SignupComponent";
import Layout from "../components/Layout";

interface SignupPropsType {
  isOpen: boolean;
  onToggle: () => void;
}

interface userDataType {
  name: string | null;
  email: string | null;
}

const Signup = ({ isOpen, onToggle }: SignupPropsType) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userData, setUserdata] = useState<userDataType>({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout isOpen={isOpen} onToggle={onToggle}>
      {isLoading && <Loader />}
      <div className="auth-page">
        <div className="auth-shell">
          <SignupComponent
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            email={email}
            setEmail={setEmail}
            handleFormSubmit={(e) =>
              handleSignupWithEmailPassword({
                e: e,
                email: email,
                password: password,
                setIsLoading: setIsLoading,
                setPassword: setPassword,
                username: username,
                setUserdata: setUserdata,
                setUsername: setUsername,
                navigate: navigate,
                userData: userData,
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
