import { useState, useEffect, useCallback } from "react";
import * as dataProvider from "../services/dataProvider";

// 클라이언트 캐시 (브라우저 세션 동안 유지)
const clientCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10분

export function useTourData(fetchFn, key) {
  const [data, setData] = useState(() => {
    const cached = clientCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  });
  const [loading, setLoading] = useState(!clientCache.has(key));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    // 캐시 확인
    const cached = clientCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      clientCache.set(key, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, key]);

  useEffect(() => {
    refetch();
  }, [key]);

  return { data, loading, error, refetch };
}

// ===== 편의 훅들 =====

export function useSpots(region) {
  return useTourData(
    () => dataProvider.getSpots(region),
    `spots:${region}`
  );
}

export function useRestaurants(region) {
  return useTourData(
    () => dataProvider.getRestaurants(region),
    `restaurants:${region}`
  );
}

export function useAccommodations(region) {
  return useTourData(
    () => dataProvider.getAccommodations(region),
    `accommodations:${region}`
  );
}
