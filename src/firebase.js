import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBE3sD8KbQW_knfVMt99FudDmjKUS2eCwo",
  authDomain: "tripdna-ai.firebaseapp.com",
  projectId: "tripdna-ai",
  storageBucket: "tripdna-ai.firebasestorage.app",
  messagingSenderId: "387842181518",
  appId: "1:387842181518:web:731ff2ce9908da002dfcdf"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;