import { Check } from "lucide-react";

export default function SelectionCard({ selected, disabled, onClick, icon: Icon, emoji, title, subtitle, accentColor = "#0066CC" }) {
  const selectedStyle = selected
    ? { borderColor: accentColor, backgroundColor: accentColor + "10" }
    : {};

  return (
    <button
      onClick={() => !disabled && onClick?.()}
      className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 text-left ${
        selected
          ? "shadow-lg"
          : disabled
          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
      }`}
      style={selectedStyle}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300"
            style={selected ? { backgroundColor: accentColor } : undefined}
          >
            <Icon className={`w-8 h-8 ${selected ? "text-white" : "text-gray-500"}`} />
          </div>
        )}
        {emoji && !Icon && (
          <div className="text-4xl">{emoji}</div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#1A1A2E]">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {selected && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor }}>
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </button>
  );
}
