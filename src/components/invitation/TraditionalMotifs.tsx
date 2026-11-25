import React from "react";

// Traditional Sri Lankan Lotus Flower Motif (Nelum Mala)
export const LotusMotif = ({ className = "w-12 h-12 text-[#C5A05A]" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central Petal */}
    <path
      d="M50 12 C44 26 38 42 50 68 C62 42 56 26 50 12 Z"
      opacity="0.95"
    />
    {/* Inner Left Petal */}
    <path
      d="M50 32 C38 34 26 44 32 64 C42 66 48 54 50 48 Z"
      opacity="0.85"
    />
    {/* Inner Right Petal */}
    <path
      d="M50 32 C62 34 74 44 68 64 C58 66 52 54 50 48 Z"
      opacity="0.85"
    />
    {/* Outer Left Petal */}
    <path
      d="M44 48 C28 50 16 62 24 74 C36 74 42 64 45 56 Z"
      opacity="0.75"
    />
    {/* Outer Right Petal */}
    <path
      d="M56 48 C72 50 84 62 76 74 C64 74 58 64 55 56 Z"
      opacity="0.75"
    />
    {/* Base Floral Scroll / Pala Pethi */}
    <path
      d="M50 66 C40 68 34 76 30 84 C38 86 46 80 50 75 C54 80 62 86 70 84 C66 76 60 68 50 66 Z"
      opacity="0.9"
    />
    {/* Center Bud/Gem */}
    <circle cx="50" cy="52" r="3.5" fill="#FFF9EF" />
  </svg>
);

// Traditional Sri Lankan Floral Corner Filigree (Liyawel Ornament)
export const CornerFiligree = ({
  className = "w-16 h-16 text-[#C5A05A]",
  position = "top-left",
}: {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  const transformMap = {
    "top-left": "",
    "top-right": "scale-x-[-1]",
    "bottom-left": "scale-y-[-1]",
    "bottom-right": "scale-[-1]",
  };

  return (
    <div className={`pointer-events-none ${transformMap[position]}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Corner Frame Lines */}
        <path d="M6 114 L6 6 L114 6" strokeWidth="2.5" />
        <path d="M12 110 L12 12 L110 12" strokeWidth="1" opacity="0.6" />
        <path d="M18 106 L18 18 L106 18" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.8" />

        {/* Traditional Liyawel / Sinhala Floral Scroll */}
        <path
          d="M18 18 C28 35 45 42 60 38 C75 34 82 22 92 24 C82 38 68 50 50 50 C32 50 24 38 18 18 Z"
          fill="currentColor"
          fillOpacity="0.25"
          strokeWidth="1"
        />
        <path
          d="M18 18 C35 28 42 45 38 60 C34 75 22 82 24 92 C38 82 50 68 50 50"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Corner Blossom */}
        <circle cx="28" cy="28" r="5" fill="currentColor" fillOpacity="0.6" strokeWidth="1" />
        <circle cx="28" cy="28" r="2" fill="#FFF9EF" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="56" cy="18" r="2" fill="currentColor" />
        <circle cx="18" cy="56" r="2" fill="currentColor" />
      </svg>
    </div>
  );
};

// Traditional Ornamental Separator with Center Lotus
export const GoldDivider = ({ className = "my-4" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 w-full max-w-md mx-auto ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A05A] to-[#C5A05A]/70" />
    <div className="flex items-center gap-1.5 text-[#C5A05A]">
      <span className="text-[10px] opacity-70">✦</span>
      <LotusMotif className="w-6 h-6 text-[#C5A05A]" />
      <span className="text-[10px] opacity-70">✦</span>
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C5A05A] to-[#C5A05A]/70" />
  </div>
);

// Traditional Sri Lankan Oil Lamp / Punkalasa Motif
export const AuspiciousSymbol = ({ className = "w-8 h-8 text-[#C5A05A]" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Flame of the traditional lamp */}
    <path d="M32 4 C30 14 24 20 28 26 C30 28 34 28 36 26 C40 20 34 14 32 4 Z" fill="#D4AF37" />
    {/* Flame glow */}
    <circle cx="32" cy="22" r="2" fill="#FFF9EF" />
    {/* Top bowl */}
    <path d="M20 28 Q32 32 44 28 L42 34 Q32 38 22 34 Z" opacity="0.9" />
    {/* Stem with decorative rings */}
    <rect x="30" y="34" width="4" height="16" rx="1" opacity="0.8" />
    <circle cx="32" cy="40" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    {/* Base of traditional brass lamp */}
    <path d="M16 54 Q32 48 48 54 L52 60 Q32 58 12 60 Z" opacity="0.95" />
    <rect x="22" y="50" width="20" height="4" rx="1" opacity="0.85" />
  </svg>
);
