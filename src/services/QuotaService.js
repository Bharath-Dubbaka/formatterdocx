import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

class QuotaService {
  static DEFAULT_FREE_QUOTA = {
    formats: { used: 0, limit: 5 },
    subscription: {
      type: "free",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };

  static async getUserQuota(uid) {
    if (!uid) return null;

    try {
      const userRef = doc(db, "quotas", uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, this.DEFAULT_FREE_QUOTA);
        return this.DEFAULT_FREE_QUOTA;
      }

      return docSnap.data();
    } catch (error) {
      console.error("Error getting user quota:", error);
      return null;
    }
  }

  static listenToQuota(uid, callback) {
    if (!uid) return () => {};

    try {
      const userRef = doc(db, "quotas", uid);
      return onSnapshot(
        userRef,
        (doc) => {
          if (doc.exists()) {
            callback(doc.data());
          } else {
            // If document doesn't exist, create it with default quota
            this.getUserQuota(uid).then((quota) => {
              if (quota) callback(quota);
            });
          }
        },
        (error) => {
          console.error("Error listening to quota:", error);
          callback(null);
        }
      );
    } catch (error) {
      console.error("Error setting up quota listener:", error);
      return () => {};
    }
  }

  static async incrementUsage(uid) {
    if (!uid) return false;

    try {
      const userRef = doc(db, "quotas", uid);
      const quota = await this.getUserQuota(uid);

      if (!quota) return false;

      if (quota.formats.used >= quota.formats.limit) {
        throw new Error("Quota limit reached");
      }

      await updateDoc(userRef, {
        "formats.used": quota.formats.used + 1,
      });

      return true;
    } catch (error) {
      console.error("Error incrementing usage:", error);
      return false;
    }
  }
}

export default QuotaService;