import { auth } from "../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";

class AuthService {
  static async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    }
  }

  static async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-out Error:", error);
      throw error;
    }
  }
}

export default AuthService;
