import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
  deps?: {
    getFirebaseServices?: () => Promise<any>;
    signInWithPopup?: (...args: any[]) => Promise<any>;
    credentialFromResult?: (...args: any[]) => any;
    credentialFromError?: (...args: any[]) => any;
    success?: (...args: any[]) => any;
    fail?: (...args: any[]) => any;
  };
}

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

async function loadFirebaseServices() {
  const { getFirebaseServices } = await import("../backend/firebaseLazy");
  return getFirebaseServices();
}

export async function handleGoogleSignin({
  setIsLoading,
  deps,
}: handleGoogleSigninProps) {
  try {
    setIsLoading(true);
    const getServices = deps?.getFirebaseServices ?? loadFirebaseServices;
    const popupSignIn = deps?.signInWithPopup ?? signInWithPopup;
    const fromResult =
      deps?.credentialFromResult ?? GoogleAuthProvider.credentialFromResult;
    const successToast = deps?.success ?? success;

    const { auth, provider } = await getServices();
    const result = await popupSignIn(auth, provider);
    const credentials = fromResult(result);
    console.log(credentials);
    successToast("🎉 signin successfull");
    return result;
  } catch (err: any) {
    if (err instanceof Error) {
      console.error(err);
      const failToast = deps?.fail ?? fail;
      failToast(err.message);
    }
    const email = err.customData?.email;
    const fromError =
      deps?.credentialFromError ?? GoogleAuthProvider.credentialFromError;
    const credential = fromError(err);
    console.log(email);
    console.log(credential);
    throw err;
  } finally {
    setIsLoading(false);
  }
}

export async function handleLogout({
  dispatch,
  setLoginStatus,
  setUserData,
  navigate,
}: HandleAuthProps) {
  const { signOut } = await import("firebase/auth");
  const { auth } = await loadFirebaseServices();
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
  const { auth } = await loadFirebaseServices();
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
