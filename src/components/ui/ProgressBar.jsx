export default function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              i < currentStep
                ? "bg-[#0066CC] scale-100"
                : i === currentStep
                ? "bg-[#0066CC] scale-125 ring-4"
                : ""
            }`}
            style={
              i === currentStep
                ? { boxShadow: "0 0 0 4px rgba(0,102,204,0.2)" }
                : i > currentStep
                ? { background: "var(--text-muted)", opacity: 0.3 }
                : undefined
            }
          />
          {i < totalSteps - 1 && (
            <div
              className={`w-6 h-0.5 transition-all duration-500 ${
                i < currentStep ? "bg-[#0066CC]" : ""
              }`}
              style={i >= currentStep ? { background: "var(--text-muted)", opacity: 0.3 } : undefined}
            />
          )}
        </div>
      ))}
    </div>
  );
}
