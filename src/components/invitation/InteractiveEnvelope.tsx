"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, MailOpen } from "lucide-react";
import confetti from "canvas-confetti";
import { LotusMotif, CornerFiligree } from "@/components/invitation/TraditionalMotifs";

interface InteractiveEnvelopeProps {
  guestName: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  onOpenInvitation: () => void;
  className?: string;
}

export function InteractiveEnvelope({
  guestName,
  brideName,
  groomName,
  weddingDate,
  onOpenInvitation,
  className = "",
}: InteractiveEnvelopeProps) {
  const [openingPhase, setOpeningPhase] = useState<"idle" | "seal-break" | "flap-open" | "card-slide">("idle");

  const handleOpenSequence = () => {
    if (openingPhase !== "idle") return;

    // Phase 1: Break seal with golden burst
    setOpeningPhase("seal-break");
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.55 },
        colors: ["#D4AF37", "#C5A05A", "#7B263A", "#FFF0BE"],
      });
    } catch {
      // Confetti fallback
    }

    // Phase 2: Unfold envelope flap
    setTimeout(() => {
      setOpeningPhase("flap-open");
    }, 450);

    // Phase 3: Slide card up from inside
    setTimeout(() => {
      setOpeningPhase("card-slide");
      try {
        confetti({
          particleCount: 90,
          spread: 95,
          origin: { y: 0.5 },
          colors: ["#D4AF37", "#C5A05A", "#7B263A", "#FFF0BE", "#E8D399"],
        });
      } catch {
        // Confetti fallback
      }
    }, 1100);

    // Phase 4: Complete transition into full card
    setTimeout(() => {
      onOpenInvitation();
    }, 2100);
  };

  const isFlapOpen = openingPhase === "flap-open" || openingPhase === "card-slide";
  const isCardSliding = openingPhase === "card-slide";

  return (
    <div className={`w-full max-w-md my-auto relative z-10 flex flex-col items-center select-none ${className}`}>
      {/* Top ceremonial greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-[#C5A05A] text-xs uppercase tracking-[0.25em] font-serif">
          <span>✦</span>
          <span>ශ්‍රී මංගලම්</span>
          <span>✦</span>
        </div>
        <p className="font-sinhala text-sm text-[#7B263A] mt-1 font-semibold">
          ආයුබෝවන්
        </p>
      </motion.div>

      {/* ============================================================== */}
      {/* 3D INTERACTIVE ROYAL ENVELOPE STAGE                           */}
      {/* ============================================================== */}
      <div className="w-full relative perspective-1000">
        <motion.div
          animate={
            openingPhase === "idle"
              ? { y: [0, -6, 0] }
              : isCardSliding
              ? { scale: 0.96, opacity: 0.85 }
              : {}
          }
          transition={
            openingPhase === "idle"
              ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.5 }
          }
          className="relative w-full rounded-2xl bg-[#F7EBD3] border-2 border-[#C5A05A]/60 shadow-2xl p-5 sm:p-7 overflow-visible cursor-pointer group"
          onClick={handleOpenSequence}
        >
          {/* Corner Filigrees on envelope body */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <CornerFiligree position="top-left" className="w-12 h-12 text-[#C5A05A]" />
          </div>
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <CornerFiligree position="top-right" className="w-12 h-12 text-[#C5A05A]" />
          </div>
          <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
            <CornerFiligree position="bottom-left" className="w-12 h-12 text-[#C5A05A]" />
          </div>
          <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
            <CornerFiligree position="bottom-right" className="w-12 h-12 text-[#C5A05A]" />
          </div>

          {/* Envelope Pocket Inner Lining (Gold Damask Motif Pattern) */}
          <div className="absolute inset-2 bg-gradient-to-b from-[#E8D399]/40 via-[#FDF4E3] to-[#F5E6C8] rounded-xl border border-[#C5A05A]/30 pointer-events-none" />

          {/* ============================================================== */}
          {/* PEEKING CARD: Slides out during phase 'card-slide'             */}
          {/* ============================================================== */}
          <motion.div
            initial={{ y: 0, scale: 0.94, opacity: 0.9 }}
            animate={
              isCardSliding
                ? { y: -140, scale: 1.03, opacity: 1, zIndex: 40 }
                : { y: 0, scale: 0.94, opacity: 0.9, zIndex: 1 }
            }
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 right-6 top-6 h-56 bg-[#FFF9EF] border-2 border-[#D4AF37] rounded-xl shadow-lg p-4 flex flex-col items-center justify-center text-center pointer-events-none"
          >
            <div className="w-7 h-7 rounded-full bg-[#7B263A]/10 border border-[#C5A05A] flex items-center justify-center mb-1">
              <LotusMotif className="w-4 h-4 text-[#C5A05A]" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#7B263A] font-semibold">
              Royal Invitation
            </p>
            <h3 className="font-serif text-lg font-bold text-[#38251F] mt-0.5">
              {brideName.split(" ")[0]} &amp; {groomName.split(" ")[0]}
            </h3>
            <p className="text-[11px] text-[#8F6F29] italic mt-0.5">
              {weddingDate}
            </p>
            <div className="mt-2 text-[10px] text-[#7B263A] font-sinhala font-medium">
              මංගල ආරාධනය
            </div>
          </motion.div>

          {/* Envelope Front Fold Flap (V-Shape with Wax Seal) */}
          <div className="relative z-20 flex flex-col items-center pt-2">
            {/* 3D Animated Top Flap */}
            <motion.div
              style={{ transformOrigin: "top center" }}
              animate={
                isFlapOpen
                  ? { rotateX: 180, y: -4, opacity: 0.25 }
                  : { rotateX: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="w-full relative preserve-3d"
            >
              {/* Triangular Flap Shape SVG */}
              <svg
                viewBox="0 0 360 120"
                className="w-full h-auto drop-shadow-md text-[#FDF4E3]"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0 L180 115 L360 0 Z"
                  fill="#FDF4E3"
                  stroke="#C5A05A"
                  strokeWidth="2"
                />
                <path
                  d="M10 5 L180 105 L350 5"
                  stroke="#D4AF37"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* Regal Maroon & Gold Wax Seal in the center of the fold */}
            <div className="relative -mt-16 sm:-mt-20 z-30 flex flex-col items-center">
              <motion.div
                animate={
                  openingPhase === "seal-break"
                    ? { scale: [1, 1.35, 0.4], opacity: [1, 1, 0], rotate: [0, 15, -20] }
                    : isFlapOpen
                    ? { opacity: 0, scale: 0 }
                    : { scale: [1, 1.05, 1] }
                }
                transition={
                  openingPhase === "idle"
                    ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.5 }
                }
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gradient-to-br from-[#8F263E] via-[#6B1828] to-[#3E101A] border-[3px] border-[#D4AF37] shadow-xl flex items-center justify-center relative cursor-pointer hover:shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                title="Click wax seal to open invitation"
              >
                {/* Traditional Sinhala Crest or Lotus inside Seal */}
                <div className="relative flex flex-col items-center justify-center">
                  <LotusMotif className="w-9 h-9 sm:w-10 sm:h-10 text-[#FFF0BE] drop-shadow" />
                  <span className="text-[9px] uppercase tracking-widest text-[#FFF0BE] font-serif font-bold mt-0.5">
                    ශ්‍රී
                  </span>
                </div>
                {/* Wax Seal Outer Organic Indent Ring */}
                <div className="absolute inset-1 rounded-full border border-[#FFF0BE]/30 pointer-events-none" />
                <div className="absolute -inset-1 rounded-full border border-[#D4AF37]/40 pointer-events-none animate-ping opacity-25" />
              </motion.div>

              {/* Pulsing prompt badge */}
              {openingPhase === "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 px-3 py-1 rounded-full bg-[#7B263A] text-[#FFF0BE] border border-[#D4AF37]/60 text-[11px] font-serif tracking-wider shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                  <span>Tap Wax Seal to Open</span>
                </motion.div>
              )}
            </div>

            {/* Couple and Ceremony Information */}
            <div className="mt-3 text-center z-20">
              <p className="text-xs uppercase tracking-[0.25em] text-[#7B263A] font-bold">
                Royal Wedding Invitation
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#38251F] mt-1 font-bold">
                {brideName.split(" ")[0]} &amp; {groomName.split(" ")[0]}
              </h2>
              <p className="text-xs text-[#8F6F29] italic mt-0.5 font-medium">
                {weddingDate}
              </p>
            </div>

            {/* Recipient Ribbon */}
            <div className="my-4 w-full bg-[#FFF9EF]/95 border-y border-[#C5A05A]/40 py-2.5 px-4 rounded-md shadow-sm z-20">
              <p className="text-[10px] uppercase tracking-wider text-[#8F6F29] font-medium">
                Cordially Prepared For
              </p>
              <p className="font-serif text-lg font-bold text-[#7B263A] mt-0.5">
                {guestName}
              </p>
            </div>

            {/* Open Button */}
            <div className="w-full z-20">
              <button
                type="button"
                disabled={openingPhase !== "idle"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenSequence();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A05A] via-[#D4AF37] to-[#C5A05A] text-[#38251F] font-serif font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-[#FFF0BE]/60 cursor-pointer disabled:opacity-70"
              >
                {openingPhase === "idle" ? (
                  <>
                    <MailOpen className="w-4 h-4 text-[#38251F]" />
                    <span>Open Your Invitation</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#38251F] animate-spin" />
                    <span>Revealing Invitation...</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-[#49382D]/75 mt-2.5 text-center font-sinhala">
                ආරාධනා පත්‍රය විවෘත කිරීමට ඔබන්න
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
