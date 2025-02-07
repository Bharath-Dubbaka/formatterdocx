import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import QuotaService from '../services/QuotaService';
import UserService from '../services/UserService';
import { setUser, clearUser, setLoading } from '../store/slices/authSlice';
import { setQuota, setTemplates, clearQuota } from '../store/slices/quotaSlice';

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            picture: user.photoURL,
          };
          dispatch(setUser(userData));

          // Get user templates
          const userTemplates = await UserService.getUserTemplates(user.uid);
          dispatch(setTemplates(userTemplates));

          // Set up quota listener
          const unsubscribeQuota = QuotaService.listenToQuota(user.uid, (quotaData) => {
            dispatch(setQuota(quotaData));
          });

          return () => {
            if (unsubscribeQuota) unsubscribeQuota();
          };
        } else {
          dispatch(clearUser());
          dispatch(clearQuota());
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        dispatch(clearUser());
        dispatch(clearQuota());
      } finally {
        dispatch(setLoading(false));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);
}

export default useAuth;