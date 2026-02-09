import { callTourApi } from "./_lib/tourApiClient.js";
import { REGION_TO_SIGUNGU, GANGWON_AREA_CODE } from "./_lib/regionCodes.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { region, page = "1", numOfRows = "20" } = req.query;

    const params = {
      areaCode: GANGWON_AREA_CODE,
      numOfRows,
      pageNo: page,
      contentTypeId: "39", // 음식점
      arrange: "Q",
    };

    if (region && REGION_TO_SIGUNGU[region]) {
      params.sigunguCode = String(REGION_TO_SIGUNGU[region]);
    }

    const items = await callTourApi("areaBasedList2", params);
    res.status(200).json({ success: true, items, count: items.length });
  } catch (err) {
    console.error("restaurants proxy error:", err);
    res.status(500).json({ success: false, error: err.message, items: [] });
  }
}
