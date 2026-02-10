import { callTourApi } from "./_lib/tourApiClient.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { contentId, contentTypeId } = req.query;
    if (!contentId) {
      return res.status(400).json({ success: false, error: "contentId required" });
    }

    // 공통정보 + 소개정보 병렬 호출
    const [common, intro] = await Promise.all([
      callTourApi("detailCommon2", { contentId }),
      contentTypeId
        ? callTourApi("detailIntro2", { contentId, contentTypeId })
        : Promise.resolve([]),
    ]);

    res.status(200).json({
      success: true,
      common: common[0] || null,
      intro: intro[0] || null,
    });
  } catch (err) {
    console.error("detail proxy error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
