const FAVORITES_KEY = "favorites";

function readFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    console.error("Failed to read favorites:", error);
    return [];
  }
}

export function getFavorites() {
  return readFavorites();
}

export function saveFavorite(item) {
  const favorites = readFavorites();

  const exists = favorites.some(
    (favorite) =>
      favorite.name === item.name &&
      favorite.address === item.address
  );

  if (exists) return false;

  favorites.push({
    ...item,
    id:
      item.id ||
      [item.type || "place", item.name, item.address].join("-"),
  });

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return true;
}

export function removeFavorite(item) {
  const updated = readFavorites().filter(
    (favorite) =>
      favorite.id !== item.id &&
      !(favorite.name === item.name && favorite.address === item.address)
  );

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}
