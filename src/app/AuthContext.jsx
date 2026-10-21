import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firebaseConfigured } from "../lib/firebase";
import { restoreUserData, syncLocalDataToCloud } from "../services/storage/cloudSync";

import AuthContext from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [cloudStatus, setCloudStatus] = useState(firebaseConfigured ? "idle" : "local");

  useEffect(() => {
    if (!auth) return undefined;
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
        void restoreUserData(nextUser).then((synced) => {
          if (!active) return;
          setCloudStatus(synced ? "synced" : "local");
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

  const logout = useCallback(async () => {
    if (!auth) return;
    await syncLocalDataToCloud(auth.currentUser);
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, loading, cloudStatus, firebaseConfigured, logout }),
    [user, loading, cloudStatus, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

