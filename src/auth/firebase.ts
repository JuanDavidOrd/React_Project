import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAfi7DPkNIIqznaX14dJj6acXlWsIFztDs",
  authDomain: "react-project-94d3b.firebaseapp.com",
  projectId: "react-project-94d3b",
  storageBucket: "react-project-94d3b.firebasestorage.app",
  messagingSenderId: "150276229717",
  appId: "1:150276229717:web:c4338c5e93ab86e807a2dc",
  measurementId: "G-41H69BFGPW",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");

microsoftProvider.setCustomParameters({
  prompt: "select_account",
  tenant: "common",
});
microsoftProvider.addScope("openid");
microsoftProvider.addScope("email");
microsoftProvider.addScope("profile");


console.log("API KEY:", import.meta.env.VITE_FIREBASE_API_KEY);
console.log("AUTH DOMAIN:", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
