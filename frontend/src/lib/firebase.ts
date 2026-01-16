import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBOIGCU4813WYDydqP79mGStmKM98tNBk",
  authDomain: "labelspy-2ce10.firebaseapp.com",
  projectId: "labelspy-2ce10",
  storageBucket: "labelspy-2ce10.firebasestorage.app",
  messagingSenderId: "1009440421534",
  appId: "1:1009440421534:web:8049278abe4690cbeaed8f",
  measurementId: "G-1R1S3YH2JL"
};

// Initialize Firebase only if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
