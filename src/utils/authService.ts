import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, provider } from '../backend/firebaseConfig';
import toast from 'react-hot-toast';

const success = (message: string) => toast.success(message);
const fail = (message: string) => toast.error(message);

export async function handleGoogleSignin() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    console.log(credentials);
    success("🎉 signin successfull");
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
