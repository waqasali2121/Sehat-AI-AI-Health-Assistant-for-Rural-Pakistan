export function SehatLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sehat AI Logo"
    >
      <defs>
        <linearGradient id="sehat-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0D9488" />
          <stop offset="50%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#FB7185" />
        </linearGradient>
      </defs>
      <path
        d="M32 56C32 56 8 40 8 22C8 14 14 8 22 8C26.4 8 30.4 10 32 13C33.6 10 37.6 8 42 8C50 8 56 14 56 22C56 40 32 56 32 56Z"
        fill="url(#sehat-gradient)"
      />
      <path
        d="M24 28C24 28 26 34 32 36C32 36 28 30 28 26C28 24 26 24 24 28Z"
        fill="white"
        fillOpacity="0.85"
      />
      <circle cx="44" cy="16" r="4" fill="white" fillOpacity="0.9" />
      <circle cx="48" cy="12" r="1.5" fill="white" fillOpacity="0.6" />
    </svg>
  );
}
