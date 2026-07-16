import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { handleSigninWithPassword } from "../utils/helperFunctions/handleSignin";
import LoginComponent from "../components/LoginComponent";
import Layout from "../components/Layout";
import { useAppDispatch, useAppSelector } from "../store/store";

interface SigninPropsType {
  isOpen: boolean;
  onToggle: () => void;
}

export let isLoggedin = false;
const Signin = ({ isOpen, onToggle }: SigninPropsType) => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false)
  const isLoggedin = useAppSelector((state) => state.userData.isLoggedin)

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedin) { 
      navigate("/")
    }
    return;
  }, [dispatch, isLoggedin,1]);

  return (
    <Layout isOpen={isOpen} onToggle={onToggle}>
      {isLoading && <Loader />}
      <div className="auth-page">
        <div className="auth-shell">
          <LoginComponent
            email={email}
            isSubmitting={isSubmitting}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleFormSubmit={(e) =>
              handleSigninWithPassword({
                email: email,
                e: e,
                setIsLoading: setIsLoading,
                setPassword: setPassword,
                password: password,
                setIsSubmitting:setIsSubmitting,
                dispatch:dispatch,
                navigate:navigate
              })
            }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Signin;
