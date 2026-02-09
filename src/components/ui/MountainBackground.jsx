export default function MountainBackground() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: "35%" }}>
      <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full" preserveAspectRatio="none" style={{ height: "100%" }}>
        <path
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,186.7C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L0,320Z"
          fill="#00A86B" fillOpacity="0.15"
        />
        <path
          d="M0,256L48,261.3C96,267,192,277,288,266.7C384,256,480,224,576,218.7C672,213,768,235,864,250.7C960,267,1056,277,1152,266.7C1248,256,1344,224,1392,208L1440,192L1440,320L0,320Z"
          fill="#0066CC" fillOpacity="0.1"
        />
      </svg>
    </div>
  );
}
