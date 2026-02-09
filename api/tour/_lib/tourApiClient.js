const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

// 서버리스 인스턴스 내 메모리 캐시 (30분 TTL)
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000;

export async function callTourApi(endpoint, params = {}) {
  const serviceKey = process.env.TOUR_API_KEY;
  if (!serviceKey) {
    throw new Error("TOUR_API_KEY not configured");
  }

  const allParams = new URLSearchParams({
    serviceKey,
    MobileOS: "ETC",
    MobileApp: "GangwonTravel",
    _type: "json",
    numOfRows: "20",
    pageNo: "1",
    ...params,
  });

  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

  // 캐시 확인
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = `${BASE_URL}/${endpoint}?${allParams.toString()}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) {
    throw new Error(`Tour API HTTP ${res.status}`);
  }

  const json = await res.json();
  const body = json?.response?.body;

  if (!body || body.totalCount === 0) {
    return [];
  }

  const items = body.items?.item;
  const result = Array.isArray(items) ? items : items ? [items] : [];

  cache.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}
