import { initializeApp } from "firebase/app";
import  {getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm0ngD4D-ELJFgsUamZmXUZOWq895bETc",
  authDomain: "drivemate-71ca2.firebaseapp.com",
  projectId: "drivemate-71ca2",
  storageBucket: "drivemate-71ca2.firebasestorage.app",
  messagingSenderId: "909822771265",
  appId: "1:909822771265:web:a0a9c7bac3adcce4d106c0",
  measurementId: "G-5CSMLZWXBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);