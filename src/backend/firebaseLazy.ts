import type { Auth} from "firebase/auth";
import type { Firestore } from "firebase/firestore/lite";
import type { FirebaseApp } from "firebase/app";

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  provider:any;
}

let firebaseServices: FirebaseServices | null = null;

export async function getFirebaseServices(): Promise<FirebaseServices> {
  if (firebaseServices) {
    return firebaseServices;
  }

  // Lazy import the full firebaseConfig only when needed
  const { app, auth, db, provider } = await import("./firebaseConfig");

  firebaseServices = { app, auth, db, provider };
  return firebaseServices;
}

// For sync operations where we must have it loaded (e.g., Navbar on initial render)
// This returns null if not yet loaded, allowing fallback UI
export function getFirebaseServicesSync(): FirebaseServices | null {
  return firebaseServices;
}
