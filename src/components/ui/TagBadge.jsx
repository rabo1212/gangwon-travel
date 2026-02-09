import { STYLE_TAG_COLORS } from "../../data/constants";

export default function TagBadge({ tag, emoji, size = "sm" }) {
  const colorClass = STYLE_TAG_COLORS[tag] || "bg-gray-100 text-gray-700 border-gray-200";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {emoji && <span>{emoji}</span>}
      {tag}
    </span>
  );
}
