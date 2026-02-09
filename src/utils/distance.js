/**
 * 두 좌표 간 직선 거리 계산 (Haversine 공식)
 * @returns 거리 (km)
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 예상 이동 시간 (분)
 * 강원도 산길 감안하여 보수적으로 계산
 */
export function estimatedTravelTime(km, mode) {
  if (mode === "자차") return (km / 40) * 60;
  return (km / 25) * 60;
}
