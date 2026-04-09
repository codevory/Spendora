import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const Api_key = import.meta.env.VITE_FIREBASE_API_KEY;
const Auth_domain = import.meta.env.VITE_Auth_Domain
const Project_Id = import.meta.env.VITE_Project_Id
const Storage_bucket = import.meta.env.VITE_storage_Bucket
const messagingSender_Id = import.meta.env.VITE_messagingSender_Id
const app_Id = import.meta.env.VITE_app_Id
const measurement_Id = import.meta.env.VITE_measurement_Id

const firebaseConfig = {
  apiKey: Api_key,
  authDomain: Auth_domain,
  projectId: Project_Id,
  storageBucket: Storage_bucket,
  messagingSenderId: messagingSender_Id,
  appId: app_Id,
  measurementId: measurement_Id
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app)


export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const db = getFirestore(app)