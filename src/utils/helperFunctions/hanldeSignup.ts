import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../backend/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);
type data = {
  name: string | null;
  email: string | null;
};
interface handleSignupProps {
  e: React.SubmitEvent<HTMLFormElement>;
  setUserdata: ({ name, email }: data) => void;
  setIsLoading: (val: boolean) => void;
  navigate: (val: string) => void;
  setPassword: (val: string) => void;
  setUsername: (val: string) => void;
  email: string;
  password: string;
  username: string;
  userData: data;
}

export async function handleSignupWithEmailPassword({
  e,
  userData,
  setUsername,
  username,
  navigate,
  email,
  password,
  setIsLoading,
  setPassword,
  setUserdata,
}: handleSignupProps) {
  setIsLoading(true);
  e.preventDefault();
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const data = {
        name: userCredentials.user.displayName,
        email: userCredentials.user.email,
      };
      setUserdata(data);
      addData({ username: username, email: email });
      console.log(data);
      success("🎉signup successfull");
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return () => clearTimeout(timer);
    })
    .catch((err) => {
      if (err instanceof Error) {
        console.error(err);
        fail(err.message);
      }
      fail("Failed to signup");
    })
    .finally(() => {
      setPassword("");
      setUsername("");
      setIsLoading(false);
    });
  console.log(userData);
}

interface dataProps {
  username: string;
  email: string;
}
async function addData({ username, email }: dataProps) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: username,
      email: email,
    });
    console.log("doc written : ", docRef.id);
  } catch (error) {
    console.error(error);
  }
}
