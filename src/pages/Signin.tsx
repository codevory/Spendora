import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGoogleSignin } from "../utils/authService";
import Loader from "../components/Loader";
import { handleSigninWithPassword } from "../utils/helperFunctions/handleSignin";
import LoginComponent from "../components/LoginComponent";
import Layout from "../components/Layout";

interface SigninPropsType {
  isOpen: boolean;
  onToggle: () => void;
}

export let isLoggedin = false;
const Signin = ({ isOpen, onToggle }: SigninPropsType) => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoged, setIsLoged] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  isLoggedin = isLoged;
  return (
      <Layout isOpen={isOpen} onToggle={onToggle}>
        {isLoading && <Loader />}
        <div className="max-w-dvw h-dvh flex justify-center items-center p-2 bg-main">
          <LoginComponent
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleFormSubmit={(e) =>
              handleSigninWithPassword({
                navigate: navigate,
                email: email,
                e: e,
                setEmail: setEmail,
                setIsLoading: setIsLoading,
                setIsLoged: setIsLoged,
                setPassword: setPassword,
                password: password,
              })
            }
            handleGoogleSign={() =>
              handleGoogleSignin({
                setIsLoading: setIsLoading,
                isLoged: isLoged,
              })
            }
          />
        </div>
      </Layout>
  );
};

export default Signin;
