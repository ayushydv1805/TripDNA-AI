import { scheduleCloudSync } from "./cloudSync";

const FAVORITES_KEY = "favorites";

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") : [];
  } catch (error) {
    console.error("Failed to read favorites:", error);
    return [];
  }
}

export function getFavorites() {
  return readFavorites();
}

export function saveFavorite(item) {
  if (!item || typeof item !== "object") return false;
  const favorites = readFavorites();
  const normalizedName = String(item.name || "").trim().toLowerCase();
  const normalizedAddress = String(item.address || "").trim().toLowerCase();

  const exists = favorites.some(
    (favorite) =>
      String(favorite.name || "").trim().toLowerCase() === normalizedName &&
      String(favorite.address || "").trim().toLowerCase() === normalizedAddress
  );
  if (exists) return false;

  favorites.unshift({
    ...item,
    id: item.id || [item.type || "place", item.name, item.address].join("-"),
    updatedAt: new Date().toISOString(),
  });

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    scheduleCloudSync();
    return true;
  } catch (error) {
    console.error("Failed to save favorite:", error);
    return false;
  }
}

export function removeFavorite(item) {
  if (!item) return;
  const updated = readFavorites().filter(
    (favorite) => favorite.id !== item.id &&
      !(favorite.name === item.name && favorite.address === item.address)
  );
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    scheduleCloudSync();
  } catch (error) {
    console.error("Failed to remove favorite:", error);
  }
}
