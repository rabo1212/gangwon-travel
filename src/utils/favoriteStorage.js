const STORAGE_KEY = "gangwon_favorite_spots";

export function getFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorite(spotName) {
  return getFavorites().some((f) => f.name === spotName);
}

export function toggleFavorite(spot) {
  const favorites = getFavorites();
  const idx = favorites.findIndex((f) => f.name === spot.name);

  if (idx >= 0) {
    favorites.splice(idx, 1);
  } else {
    favorites.push({
      name: spot.name,
      region: spot.region,
      category: spot.category,
      emoji: spot.emoji,
      savedAt: new Date().toISOString(),
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.warn("찜 저장 실패:", e);
  }

  return idx < 0; // true = 새로 추가됨, false = 제거됨
}
