import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirebaseServices } from "../backend/firebaseLazy";
import toast from "react-hot-toast";
import type { AppDispatch } from "../store/store";
import {
  setLoginStatus,
  setUserData,
  setError,
} from "../store/features/userAuthenication";

interface HandleAuthProps {
  dispatch: AppDispatch;
  navigate: (path: string) => void;
  setLoginStatus: typeof setLoginStatus;
  setUserData: typeof setUserData;
  setError: typeof setError;
}
interface handleGoogleSigninProps {
  setIsLoading: (val: boolean) => void;
}

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

export async function handleGoogleSignin({
  setIsLoading,
}: handleGoogleSigninProps) {
  try {
    setIsLoading(true);
    const { auth, provider } = await getFirebaseServices();
    const result = await signInWithPopup(auth, provider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    console.log(credentials);
    success("🎉 signin successfull");
    setIsLoading(false);
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
    throw err;
  }
}

export async function handleLogout({
  dispatch,
  setLoginStatus,
  setUserData,
  navigate,
}: HandleAuthProps) {
  const { signOut } = await import("firebase/auth");
  const { auth } = await getFirebaseServices();
  await signOut(auth);
  dispatch(setLoginStatus(false));
  dispatch(setUserData(null));
  navigate("/signin");
}

export async function handleDeleteAccount({
  dispatch,
  navigate,
  setError,
  setLoginStatus,
  setUserData,
}: HandleAuthProps) {
  const { auth } = await getFirebaseServices();
  if (!auth?.currentUser) {
    dispatch(
      setError({
        message: "Account deletion requires a signed-in user.",
        code: 404,
      }),
    );
    return;
  }

  auth.currentUser.delete();
  dispatch(setUserData(null));
  dispatch(setLoginStatus(false));
  navigate("/signup");
}
