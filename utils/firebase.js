// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "login-667c2.firebaseapp.com",
  projectId: "login-667c2",
  storageBucket: "login-667c2.appspot.com",
  messagingSenderId: "791063018072",
  appId: "1:791063018072:web:dddb2452a9de6f23a3682d",
  measurementId: "G-54LXT2QK5X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
// Only initialize analytics in browser environments
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
