import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

class AuthService {
   static async signInWithGoogle() {
      try {
         const provider = new GoogleAuthProvider();
         const result = await signInWithPopup(auth, provider);
         return {
            uid: result.user.uid,
            email: result.user.email,
            name: result.user.displayName,
            picture: result.user.photoURL,
         };
      } catch (error) {
         console.error("Sign in error:", error);
         throw error;
      }
   }

   static async signOut() {
      try {
         await auth.signOut();
         return true;
      } catch (error) {
         console.error("Sign out error:", error);
         throw error;
      }
   }
}

export default AuthService;
