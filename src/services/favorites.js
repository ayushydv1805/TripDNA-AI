export function saveFavorite(item) {
  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  const exists = favorites.find(
    (fav) =>
      fav.name === item.name &&
      fav.address === item.address
  );

  if (!exists) {
    favorites.push(item);

    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function removeFavorite(name) {
  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  const updated = favorites.filter(
    (item) => item.name !== name
  );

  localStorage.setItem(
    "favorites",
    JSON.stringify(updated)
  );
}