const STORAGE_KEY = "gangwon_saved_trips";
const MAX_TRIPS = 10;

export function getSavedTrips() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTrip(tripData) {
  try {
    const trips = getSavedTrips();
    const newTrip = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      savedAt: new Date().toISOString(),
      zone: {
        id: tripData.zone.id,
        name: tripData.zone.name,
        emoji: tripData.zone.emoji,
        nameKo: tripData.zone.nameKo,
      },
      vibes: tripData.vibes,
      duration: tripData.duration,
      travelMode: tripData.travelMode,
      spotCount: tripData.route.itinerary.reduce(
        (sum, day) => sum + day.schedule.filter((s) => s.type === "spot").length,
        0
      ),
      route: tripData.route,
    };

    trips.unshift(newTrip);
    if (trips.length > MAX_TRIPS) trips.pop();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return { success: true };
  } catch (e) {
    console.warn("일정 저장 실패:", e);
    return { success: false };
  }
}

export function deleteTrip(tripId) {
  try {
    const trips = getSavedTrips().filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return true;
  } catch {
    return false;
  }
}
