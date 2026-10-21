import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../../lib/firebase";

const TRIPS_KEY = "savedTrips";
const FAVORITES_KEY = "favorites";
const RECENT_SEARCHES_KEY = "recentSearches";
let syncTimer = null;
let queuedUser = null;

function readArray(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn("Could not restore local TripDNA data:", error);
    return false;
  }
}

function identity(item, kind) {
  if (kind === "favorite") {
    return [item.id || "", item.name || "", item.address || ""]
      .join("|").trim().toLowerCase();
  }
  return [item.from || "", item.to || ""].join("|").trim().toLowerCase();
}

function itemTime(item) {
  const value = Date.parse(item.updatedAt || item.timestamp || item.date || "");
  return Number.isFinite(value) ? value : 0;
}

function mergeEntries(localItems, cloudItems, kind, limit) {
  const merged = new Map();
  for (const item of [...localItems, ...cloudItems]) {
    if (!item || typeof item !== "object") continue;
    const key = identity(item, kind);
    if (!key.replace(/\|/g, "")) continue;
    const current = merged.get(key);
    if (!current || itemTime(item) > itemTime(current)) merged.set(key, item);
  }
  return [...merged.values()].sort((a, b) => itemTime(b) - itemTime(a)).slice(0, limit);
}

function travelDataRef(userId) {
  return doc(db, "users", userId, "appData", "travel");
}

export async function syncLocalDataToCloud(user = auth?.currentUser) {
  if (!firebaseConfigured || !db || !user?.uid) return false;
  try {
    await setDoc(travelDataRef(user.uid), {
      savedTrips: readArray(TRIPS_KEY).slice(0, 20),
      favorites: readArray(FAVORITES_KEY).slice(0, 100),
      recentSearches: readArray(RECENT_SEARCHES_KEY).slice(0, 10),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("TripDNA cloud backup is unavailable; keeping local data:", error);
    return false;
  }
}

export async function restoreUserData(user) {
  if (!firebaseConfigured || !db || !user?.uid) return false;
  try {
    const snapshot = await getDoc(travelDataRef(user.uid));
    const remote = snapshot.exists() ? snapshot.data() : {};
    const merged = {
      savedTrips: mergeEntries(readArray(TRIPS_KEY), Array.isArray(remote.savedTrips) ? remote.savedTrips : [], "trip", 20),
      favorites: mergeEntries(readArray(FAVORITES_KEY), Array.isArray(remote.favorites) ? remote.favorites : [], "favorite", 100),
      recentSearches: mergeEntries(readArray(RECENT_SEARCHES_KEY), Array.isArray(remote.recentSearches) ? remote.recentSearches : [], "search", 10),
    };
    const writesSucceeded = [
      writeArray(TRIPS_KEY, merged.savedTrips),
      writeArray(FAVORITES_KEY, merged.favorites),
      writeArray(RECENT_SEARCHES_KEY, merged.recentSearches),
    ].every(Boolean);
    if (!writesSucceeded) return false;
    await setDoc(travelDataRef(user.uid), { ...merged, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Could not restore TripDNA cloud backup:", error);
    return false;
  }
}

export function scheduleCloudSync() {
  const user = auth?.currentUser;
  if (!firebaseConfigured || !db || !user?.uid) return;
  queuedUser = user;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const userToSync = queuedUser;
    queuedUser = null;
    syncTimer = null;
    void syncLocalDataToCloud(userToSync);
  }, 350);
}
