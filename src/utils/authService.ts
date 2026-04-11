import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseServices } from "../backend/firebaseLazy";
import toast from "react-hot-toast";

interface handleGoogleSigninProps {
  setIsLoading: (val: boolean) => void;
  isLoged: boolean;
}

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

export async function handleGoogleSignin({
  setIsLoading,
  isLoged,
}: handleGoogleSigninProps) {
  try {
    setIsLoading(true);
    const { auth, provider } = await getFirebaseServices();
    const result = await signInWithPopup(auth, provider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    console.log(credentials);
    success("🎉 signin successfull");
    setIsLoading(false);
    isLoged = true;
    return result;
  } catch (err: any) {
    if (err instanceof Error) {
      console.error(err);
      fail(err.message);
    }
    const email = err.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(err);
    console.log(email);
    console.log(credential);
    isLoged = false;
    throw err;
  }
  console.log(isLoged);
}
