// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-web-builder-24308.firebaseapp.com",
  projectId: "ai-web-builder-24308",
  storageBucket: "ai-web-builder-24308.firebasestorage.app",
  messagingSenderId: "165938444092",
  appId: "1:165938444092:web:66d590462133f0772fd039"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider}