import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrh62v2o2XT1V2vb99x47FirdDu3tKRNo",
  authDomain: "booknest-e2793.firebaseapp.com",
  projectId: "booknest-e2793",
  storageBucket: "booknest-e2793.firebasestorage.app",
  messagingSenderId: "15871482374",
  appId: "1:15871482374:web:527577f0ad0d9ea8a68187",
  measurementId: "G-PFTTEJKKT1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});