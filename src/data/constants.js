import { Heart, Compass, UtensilsCrossed, Landmark, Camera, TreePine } from "lucide-react";

export const TRAVEL_STYLES = [
  { id: "휴양/힐링", label: "휴양/힐링", emoji: "🧘", icon: Heart, color: "text-green-600" },
  { id: "체험/액티비티", label: "체험/액티비티", emoji: "🤸", icon: Compass, color: "text-orange-500" },
  { id: "맛집/미식", label: "맛집/미식", emoji: "🍽️", icon: UtensilsCrossed, color: "text-red-500" },
  { id: "문화/역사", label: "문화/역사", emoji: "🏛️", icon: Landmark, color: "text-blue-600" },
  { id: "포토스팟/감성", label: "포토스팟/감성", emoji: "📸", icon: Camera, color: "text-pink-500" },
  { id: "자연/트레킹", label: "자연/트레킹", emoji: "🌲", icon: TreePine, color: "text-emerald-600" },
];

export const FOOD_GENRES = [
  { id: "한식", label: "한식", emoji: "🍚" },
  { id: "양식", label: "양식", emoji: "🍝" },
  { id: "중식", label: "중식", emoji: "🥟" },
  { id: "일식", label: "일식", emoji: "🍣" },
  { id: "카페", label: "카페/디저트", emoji: "☕" },
  { id: "분식", label: "분식/간식", emoji: "🍢" },
];

export const RESTAURANT_STYLES = [
  { id: "미슐랭", label: "미슐랭/블루리본", emoji: "🏆", color: "bg-amber-100 text-amber-800" },
  { id: "노포", label: "노포 (30년+)", emoji: "🕰️", color: "bg-amber-800/10 text-amber-900" },
  { id: "방송맛집", label: "방송 출연 맛집", emoji: "📺", color: "bg-pink-100 text-pink-700" },
  { id: "향토음식", label: "로컬 향토음식", emoji: "🌾", color: "bg-green-100 text-green-800" },
  { id: "가성비", label: "가성비 맛집", emoji: "💰", color: "bg-blue-100 text-blue-700" },
  { id: "핫플", label: "핫플레이스", emoji: "🔥", color: "bg-red-100 text-red-600" },
];

export const DURATION_OPTIONS = [
  { id: "당일치기", label: "당일치기", days: 1, emoji: "☀️", sub: "하루 동안 알차게" },
  { id: "1박2일", label: "1박2일", days: 2, emoji: "🌙", sub: "여유로운 하룻밤" },
  { id: "2박3일", label: "2박3일", days: 3, emoji: "🌟", sub: "깊이 있는 여행" },
];

export const ACCOMMODATION_TYPES = [
  { id: "호텔", label: "호텔", emoji: "🏨" },
  { id: "리조트", label: "리조트", emoji: "🏖️" },
  { id: "펜션", label: "펜션", emoji: "🏡" },
  { id: "에어비앤비", label: "에어비앤비", emoji: "🏠" },
  { id: "게스트하우스", label: "게스트하우스", emoji: "🛏️" },
  { id: "한옥스테이", label: "한옥스테이", emoji: "🏯" },
];

export const ACCOMMODATION_TYPE_COLORS = {
  "호텔": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "리조트": "bg-cyan-100 text-cyan-700 border-cyan-200",
  "펜션": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "에어비앤비": "bg-rose-100 text-rose-700 border-rose-200",
  "게스트하우스": "bg-violet-100 text-violet-700 border-violet-200",
  "한옥스테이": "bg-amber-100 text-amber-700 border-amber-200",
};

export const STYLE_TAG_COLORS = {
  "미슐랭": "bg-amber-100 text-amber-800 border-amber-200",
  "노포": "bg-stone-100 text-stone-800 border-stone-200",
  "방송맛집": "bg-pink-100 text-pink-700 border-pink-200",
  "향토음식": "bg-green-100 text-green-800 border-green-200",
  "가성비": "bg-blue-100 text-blue-700 border-blue-200",
  "핫플": "bg-red-100 text-red-600 border-red-200",
};

export const STYLE_EMOJIS = {
  "미슐랭": "🏆", "노포": "🕰️", "방송맛집": "📺",
  "향토음식": "🌾", "가성비": "💰", "핫플": "🔥",
};

export const GENRE_EMOJIS = {
  "한식": "🍚", "양식": "🍝", "중식": "🥟",
  "일식": "🍣", "카페": "☕", "분식": "🍢",
  "치킨": "🍗", "베이커리": "🥐",
};
