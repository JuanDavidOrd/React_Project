
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAqMfoMflVVCELlT4KJVZunHEfnf_6dfoI",
  authDomain: "mssecurity-8d42c.firebaseapp.com",
  projectId: "mssecurity-8d42c",
  storageBucket: "mssecurity-8d42c.firebasestorage.app",
  messagingSenderId: "403544613279",
  appId: "1:403544613279:web:6d7c9b27a1e5978f4f9daa",
  measurementId: "G-0QN9XT7BM1"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.setCustomParameters({
  prompt: 'select_account',
  tenant: 'common',
});
microsoftProvider.addScope('openid');
microsoftProvider.addScope('email');
microsoftProvider.addScope('profile');