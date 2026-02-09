/**
 * 카카오 REST API로 모든 장소의 주소를 좌표로 변환하는 스크립트
 * 실행: node scripts/geocode.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REST_API_KEY = process.env.KAKAO_REST_KEY || "YOUR_KAKAO_REST_API_KEY";

const FOLDERS = ["spots", "restaurants", "accommodations"];
const DATA_DIR = path.join(__dirname, "..", "src", "data");

// 주소 → 좌표 변환 (주소검색 → 키워드검색 폴백)
async function geocode(query) {
  // 1차: 주소 검색
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
      { headers: { Authorization: `KakaoAK ${REST_API_KEY}` } }
    );
    const data = await res.json();
    if (data.documents && data.documents.length > 0) {
      return {
        latitude: parseFloat(data.documents[0].y),
        longitude: parseFloat(data.documents[0].x),
      };
    }
  } catch (e) {
    // ignore
  }

  // 2차: 키워드 검색 (장소명 + 주소)
  try {
    const res2 = await fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}`,
      { headers: { Authorization: `KakaoAK ${REST_API_KEY}` } }
    );
    const data2 = await res2.json();
    if (data2.documents && data2.documents.length > 0) {
      return {
        latitude: parseFloat(data2.documents[0].y),
        longitude: parseFloat(data2.documents[0].x),
      };
    }
  } catch (e) {
    // ignore
  }

  return null;
}

// JS 파일에서 배열 데이터 파싱 (export const xxx = [...])
function parseDataFile(content) {
  // 이미 latitude가 있으면 스킵 체크용
  const hasCoords = content.includes("latitude:");
  return { hasCoords };
}

// 파일에서 각 항목의 address를 추출하고 좌표를 추가
async function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const { hasCoords } = parseDataFile(content);

  if (hasCoords) {
    console.log(`  ⏭️  이미 좌표 있음: ${path.basename(filePath)}`);
    return 0;
  }

  // address 필드를 찾아서 좌표 추가
  // 패턴: address: "..." 뒤에 latitude가 없으면 추가
  const addressRegex = /address:\s*"([^"]+)"/g;
  const nameRegex = /name:\s*"([^"]+)"/g;

  // 모든 항목의 name과 address 추출
  const names = [];
  const addresses = [];
  let match;

  while ((match = nameRegex.exec(content)) !== null) {
    names.push(match[1]);
  }
  while ((match = addressRegex.exec(content)) !== null) {
    addresses.push(match[1]);
  }

  if (addresses.length === 0) {
    console.log(`  ⚠️  address 필드 없음: ${path.basename(filePath)}`);
    return 0;
  }

  console.log(`  📍 ${path.basename(filePath)}: ${addresses.length}개 항목 변환 중...`);

  let count = 0;
  for (let i = 0; i < addresses.length; i++) {
    const addr = addresses[i];
    const name = names[i] || "";

    // 주소로 검색, 실패하면 이름+주소로 검색
    let coords = await geocode(addr);
    if (!coords && name) {
      coords = await geocode(`${name} ${addr.split(" ").slice(0, 3).join(" ")}`);
    }
    if (!coords && name) {
      coords = await geocode(name);
    }

    if (coords) {
      // address: "..." 다음 줄에 latitude, longitude 추가
      const addressStr = `address: "${addr}"`;
      const replacement = `address: "${addr}",\n    latitude: ${coords.latitude},\n    longitude: ${coords.longitude}`;
      content = content.replace(addressStr, replacement);
      count++;
      process.stdout.write(`    ✅ ${name || addr} (${coords.latitude}, ${coords.longitude})\n`);
    } else {
      process.stdout.write(`    ❌ 변환 실패: ${name || addr}\n`);
    }

    // Rate limit 방지 (100ms 딜레이)
    await new Promise((r) => setTimeout(r, 100));
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return count;
}

async function main() {
  console.log("🚀 강원도 여행 앱 - 좌표 데이터 일괄 변환 시작\n");

  let totalCount = 0;
  let totalFiles = 0;

  for (const folder of FOLDERS) {
    const folderPath = path.join(DATA_DIR, folder);
    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  폴더 없음: ${folder}`);
      continue;
    }

    console.log(`\n📂 ${folder}/`);

    const files = fs.readdirSync(folderPath).filter(
      (f) => f.endsWith(".js") && f !== "index.js"
    );

    for (const file of files) {
      const count = await processFile(path.join(folderPath, file));
      totalCount += count;
      totalFiles++;
    }
  }

  console.log(`\n✨ 완료! ${totalFiles}개 파일에서 ${totalCount}개 항목에 좌표 추가됨`);
}

main().catch(console.error);
