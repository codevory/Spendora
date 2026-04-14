import { type AppDispatch } from "../store/store";
import { setError, setLoading, setLoginStatus, setUserData, type userDataType } from '../store/features/userAuthenication';
import { getFirebaseServices } from './firebaseLazy'
import { collection, getDocs, limit, query, where } from "firebase/firestore/lite";

export async function getUserData(dispatch: AppDispatch) {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const { auth, db } = await getFirebaseServices();

    const user = auth.currentUser;
    if (!user?.email) {
      dispatch(setUserData(null));
      dispatch(
        setError({
          message: "No authenticated user found. Please sign in again.",
          code: 404,
        }),
      );
      return null;
    }

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", user.email),
      limit(1),
    );

    const snapshot = await getDocs(userQuery);
    const docData = snapshot.docs[0]?.data() as Partial<userDataType> | undefined;

    const resolved: userDataType = {
      name: docData?.name || user.displayName || "Spendora User",
      email: docData?.email || user.email,
      age: typeof docData?.age === "number" ? docData.age : undefined,
      image: docData?.image || "/default-man.webp",
    };

    dispatch(setUserData(resolved));
    dispatch(setLoginStatus(true));

    return resolved;
  } catch (err) {
    dispatch(
      setError(
        err instanceof Error
          ? { message: err.message, code: 302 }
          : { message: "Failed to load account", code: 201 },
      ),
    );
    dispatch(setLoginStatus(false));
    dispatch(setUserData(null));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
}

export default getUserData
