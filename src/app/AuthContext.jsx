import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firebaseConfigured } from "../lib/firebase";
import {
  createLocalAccount,
  getLocalSession,
  signInLocalAccount,
  signOutLocalAccount,
} from "../services/auth/localAuth";
import { restoreUserData, syncLocalDataToCloud } from "../services/storage/cloudSync";

import AuthContext from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getLocalSession());
  const [loading, setLoading] = useState(Boolean(auth));
  const [cloudStatus, setCloudStatus] = useState(
    firebaseConfigured ? "idle" : "local"
  );

  useEffect(() => {
    if (!auth) {
      setUser(getLocalSession());
      setCloudStatus("local");
      setLoading(false);
      return undefined;
    }

    let active = true;
    const unsubscribe = onAuthStateChanged(
      auth,
      (nextUser) => {
        if (!active) return;
        setUser(nextUser);
        if (!nextUser) {
          setCloudStatus("idle");
          setLoading(false);
          return;
        }

        setCloudStatus("syncing");
        void restoreUserData(nextUser)
          .then((synced) => {
            if (!active) return;
            setCloudStatus(synced ? "synced" : "local");
            setLoading(false);
          })
          .catch((error) => {
            console.warn("TripDNA cloud backup could not be restored:", error);
            if (!active) return;
            // Authentication can still be successful when cloud sync/rules fail.
            setCloudStatus("local");
            setLoading(false);
          });
      },
      (error) => {
        console.warn("TripDNA authentication state could not be loaded:", error);
        if (active) {
          setUser(null);
          setCloudStatus("local");
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const createLocalProfile = useCallback(async (details) => {
    const localUser = await createLocalAccount(details);
    setUser(localUser);
    setCloudStatus("local");
    setLoading(false);
    return localUser;
  }, []);

  const signInLocal = useCallback(async (credentials) => {
    const localUser = await signInLocalAccount(credentials);
    setUser(localUser);
    setCloudStatus("local");
    setLoading(false);
    return localUser;
  }, []);

  const logout = useCallback(async () => {
    if (user?.isLocalAccount || !auth) {
      signOutLocalAccount();
      setUser(null);
      setCloudStatus("local");
      return;
    }
    await syncLocalDataToCloud(auth.currentUser);
    await signOut(auth);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      cloudStatus,
      firebaseConfigured,
      logout,
      createLocalProfile,
      signInLocal,
    }),
    [user, loading, cloudStatus, logout, createLocalProfile, signInLocal]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
