"use client";

import React from "react";

interface CeremonialLampProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CeremonialLamp({ className = "", size = "md" }: CeremonialLampProps) {
  const sizeMap = {
    sm: "w-8 h-12",
    md: "w-10 h-16",
    lg: "w-14 h-22",
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 80 120"
        className={`${sizeMap[size]} text-[#C5A05A] drop-shadow-sm`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Flame Gradient */}
          <radialGradient id="lampFlameGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFF0BE" />
            <stop offset="70%" stopColor="#FF9F1C" />
            <stop offset="100%" stopColor="#E63946" />
          </radialGradient>

          {/* Brass Lamp Gradient */}
          <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF0BE" />
            <stop offset="100%" stopColor="#8F6F29" />
          </linearGradient>
        </defs>

        {/* ============================================================== */}
        {/* ANIMATED ORGANIC FLAME (PAHAN SILUWA)                         */}
        {/* ============================================================== */}
        <g className="animate-flame" style={{ transformOrigin: "40px 42px" }}>
          {/* Outer Flame Glow Halo */}
          <ellipse cx="40" cy="30" rx="14" ry="18" fill="url(#lampFlameGlow)" opacity="0.35" filter="blur(3px)" />

          {/* Main Flickering Flame */}
          <path
            d="M40 8 C34 20 28 28 32 38 C34 42 38 44 40 44 C42 44 46 42 48 38 C52 28 46 20 40 8 Z"
            fill="url(#lampFlameGlow)"
          />

          {/* Inner Bright Heart Flame */}
          <path
            d="M40 18 C37 24 34 30 36 36 C38 38 40 39 40 39 C40 39 42 38 44 36 C46 30 43 24 40 18 Z"
            fill="#FFFFFF"
            opacity="0.9"
          />
        </g>

        {/* Cotton Wick / Watiya */}
        <line x1="40" y1="40" x2="40" y2="46" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round" />

        {/* ============================================================== */}
        {/* TRADITIONAL BRASS OIL LAMP BODY (MAGUL PAHANA)                 */}
        {/* ============================================================== */}
        {/* Top Oil Bowl */}
        <ellipse cx="40" cy="46" rx="22" ry="7" fill="url(#brassGradient)" stroke="#8F6F29" strokeWidth="1" />
        <ellipse cx="40" cy="44" rx="18" ry="4" fill="#C5A05A" />
        <ellipse cx="40" cy="44" rx="12" ry="2.5" fill="#7B263A" opacity="0.4" />

        {/* Stem with Traditional Turned Rings */}
        <path
          d="M36 48 L35 72 L45 72 L44 48 Z"
          fill="url(#brassGradient)"
          stroke="#8F6F29"
          strokeWidth="0.8"
        />
        {/* Decorative Middle Ring */}
        <circle cx="40" cy="60" r="5" fill="url(#brassGradient)" stroke="#8F6F29" strokeWidth="0.8" />
        <circle cx="40" cy="60" r="2.5" fill="#FFF0BE" />

        {/* Lower Flared Base */}
        <path
          d="M32 72 L24 98 C24 102 30 104 40 104 C50 104 56 102 56 98 L48 72 Z"
          fill="url(#brassGradient)"
          stroke="#8F6F29"
          strokeWidth="1"
        />
        {/* Tiered Circular Base Stand */}
        <ellipse cx="40" cy="98" rx="26" ry="6" fill="url(#brassGradient)" stroke="#8F6F29" strokeWidth="1" />
        <ellipse cx="40" cy="103" rx="30" ry="7" fill="url(#brassGradient)" stroke="#8F6F29" strokeWidth="1" />
      </svg>
    </div>
  );
}
