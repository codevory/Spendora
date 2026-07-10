import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { handleSignupWithEmailPassword } from "../utils/helperFunctions/handleSignup";
import SignupComponent from "../components/RegisterForm";
import Layout from "../components/Layout";
import { useAppSelector } from "../store/store";

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
  const [isSubmitting,setIsSubmitting] = useState<boolean>(false)

  const { isLoggedin } = useAppSelector((state) => state.userData)

  const navigate = useNavigate();
  
  useEffect(() => {
    if(isLoggedin){
      navigate("/")
    }

  },[isLoggedin,1])


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
            isSubmitting={isSubmitting}
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
                setErrorMessage:setErrorMessage,
                setIsSubmitting:setIsSubmitting
              })
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
