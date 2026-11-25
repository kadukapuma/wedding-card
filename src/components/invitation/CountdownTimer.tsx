"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";

interface CountdownTimerProps {
  weddingDateStr?: string; // e.g. "2026-10-18" or "Sunday, 18th October 2026"
  poruwaTimeStr?: string;  // e.g. "09:45 AM"
  className?: string;
}

export function CountdownTimer({
  weddingDateStr = "2026-10-18",
  poruwaTimeStr = "09:45 AM",
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    // Determine target date
    let target = new Date("2026-10-18T09:45:00");
    if (weddingDateStr) {
      const parsed = new Date(weddingDateStr);
      if (!isNaN(parsed.getTime())) {
        target = parsed;
      }
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr, poruwaTimeStr]);

  if (timeLeft.isPast) {
    return (
      <div className={`text-center py-2 px-4 rounded-xl bg-[#FDF4E3] border border-[#C5A05A]/40 ${className}`}>
        <p className="font-serif text-sm font-bold text-[#7B263A]">
          The Auspicious Wedding Ceremony Has Taken Place
        </p>
        <p className="text-xs text-[#8F6F29]">May their journey be filled with lifelong joy &amp; harmony</p>
      </div>
    );
  }

  const units = [
    { label: "Days", labelSi: "දින", value: timeLeft.days },
    { label: "Hours", labelSi: "පැය", value: timeLeft.hours },
    { label: "Mins", labelSi: "මිනිත්තු", value: timeLeft.minutes },
    { label: "Secs", labelSi: "තත්පර", value: timeLeft.seconds },
  ];

  return (
    <div className={`w-full max-w-md mx-auto my-3 ${className}`}>
      <div className="flex items-center justify-center gap-1.5 text-xs text-[#7B263A] font-bold uppercase tracking-wider mb-2">
        <Clock className="w-3.5 h-3.5 text-[#C5A05A] animate-spin-slow" />
        <span>නැකත් වේලාවට ගණනය / Auspicious Countdown</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {units.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-b from-[#FFFDF8] to-[#FDF4E3] border border-[#C5A05A]/40 shadow-sm relative overflow-hidden group hover:border-[#D4AF37] transition-all"
          >
            {/* Top gold accent line */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

            <span className="font-serif text-xl sm:text-2xl font-black text-[#38251F] leading-none">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#8F6F29] mt-1">
              {unit.label}
            </span>
            <span className="text-[8px] font-sinhala text-[#7B263A]/80 leading-none">
              {unit.labelSi}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
