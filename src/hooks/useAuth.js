import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import QuotaService from '../services/QuotaService';
import UserService from '../services/UserService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          picture: user.photoURL,
        };
        setUser(userData);

        // Get user templates
        const userTemplates = await UserService.getUserTemplates(user.uid);
        setTemplates(userTemplates);

        // Set up quota listener
        const unsubscribeQuota = QuotaService.listenToQuota(user.uid, (quotaData) => {
          setQuota(quotaData);
        });

        return () => {
          unsubscribeQuota();
        };
      } else {
        setUser(null);
        setQuota(null);
        setTemplates([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, quota, templates, loading };
}

export default useAuth;