"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import confetti from "canvas-confetti";
import { ART, EASE } from "./shared";

type Phase = "sealed" | "cracking" | "unfolding" | "rising" | "leaving";

const ORDER: Phase[] = ["sealed", "cracking", "unfolding", "rising", "leaving"];

const PAPER = "url(/images/textures/paper-maroon.webp)";

/** A folded panel of the envelope: textured paper, shaded, with a gilt edge. */
function Panel({
  clip,
  shade,
  edge,
}: {
  clip: string;
  shade: string;
  edge: string;
}) {
  return (
    <div className="absolute inset-0" style={{ filter: "drop-shadow(0 0 7px rgba(10,0,3,0.55))" }}>
      <div
        className="absolute inset-0"
        style={{
          clipPath: clip,
          backgroundImage: `${shade}, ${PAPER}`,
          backgroundSize: "100% 100%, 300px 300px",
        }}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <polyline
          points={edge}
          fill="none"
          stroke="url(#giltEdge)"
          strokeWidth="1.3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

const FLAP_OUTER = "polygon(0 0, 100% 0, 55% 94%, 52% 98.6%, 50% 100%, 48% 98.6%, 45% 94%)";
const FLAP_INNER = "polygon(0 100%, 100% 100%, 55% 6%, 52% 1.4%, 50% 0, 48% 1.4%, 45% 6%)";

const SEAL_HALVES = [
  {
    clip: "polygon(0 0, 53% 0, 45% 20%, 56% 38%, 43% 57%, 55% 76%, 47% 100%, 0 100%)",
    exit: { x: "-48%", y: "55%", rotate: -34 },
  },
  {
    clip: "polygon(53% 0, 100% 0, 100% 100%, 47% 100%, 55% 76%, 43% 57%, 56% 38%, 45% 20%)",
    exit: { x: "52%", y: "40%", rotate: 28 },
  },
];

export function EnvelopeScene({
  guestName,
  brideName,
  groomName,
  dateLabel,
  onStart,
  onOpened,
}: {
  guestName: string;
  brideName: string;
  groomName: string;
  dateLabel: string;
  onStart: () => void;
  onOpened: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const [flapBehind, setFlapBehind] = useState(false);
  const timers = useRef<number[]>([]);
  const sealRef = useRef<HTMLButtonElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), { stiffness: 90, damping: 18 });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 90, damping: 18 });

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const reached = (target: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(target);

  const open = () => {
    if (phase !== "sealed") return;
    onStart();
    setPhase("cracking");
    pointerX.set(0);
    pointerY.set(0);

    const box = sealRef.current?.getBoundingClientRect();
    if (box) {
      void confetti({
        particleCount: 60,
        spread: 360,
        startVelocity: 18,
        gravity: 0.5,
        ticks: 90,
        scalar: 0.65,
        origin: {
          x: (box.left + box.width / 2) / window.innerWidth,
          y: (box.top + box.height / 2) / window.innerHeight,
        },
        colors: ["#f7dc8f", "#d4a94e", "#a77b27", "#fff4cf"],
        disableForReducedMotion: true,
      });
    }

    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    at(650, () => setPhase("unfolding"));
    at(1100, () => setFlapBehind(true));
    at(1750, () => setPhase("rising"));
    at(3300, () => setPhase("leaving"));
    at(4000, onOpened);
  };

  const first = (name: string) => name.split(" ")[0];

  return (
    <motion.div
      className="paper-white fixed inset-0 z-20 flex flex-col items-center justify-center overflow-hidden px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onPointerMove={(e) => {
        if (phase !== "sealed" || e.pointerType !== "mouse") return;
        pointerX.set(e.clientX / window.innerWidth - 0.5);
        pointerY.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="giltEdge" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8a6425" />
            <stop offset="0.35" stopColor="#f3dc9b" />
            <stop offset="0.65" stopColor="#a67c32" />
            <stop offset="1" stopColor="#e6c778" />
          </linearGradient>
        </defs>
      </svg>

      <span className="wash wash-rose left-[-20%] top-[-6%]" aria-hidden="true" />
      <span className="wash wash-gold right-[-22%] top-[30%]" aria-hidden="true" />
      <span className="wash wash-wine bottom-[-12%] left-[10%]" aria-hidden="true" />

      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: reached("unfolding") ? 0 : 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <p className="font-sinhala text-lg font-semibold text-[#7b263a]">ශ්‍රී මංගලම්</p>
        <p className="mt-1 font-cinzel text-[11px] font-semibold uppercase tracking-[0.42em] text-[#8a6425]">
          A wedding invitation
        </p>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Envelope                                                         */}
      {/* ---------------------------------------------------------------- */}
      <motion.div
        className="relative mt-10 aspect-[10/7] w-[min(88vw,460px,62vh)] sm:mt-12"
        initial={{ opacity: 0, y: 90, rotateZ: -4, scale: 0.88 }}
        animate={{
          opacity: reached("leaving") ? 0 : 1,
          y: reached("rising") ? "26%" : reached("unfolding") ? "12%" : "0%",
          rotateZ: 0,
          scale: reached("leaving") ? 1.35 : 1,
        }}
        transition={{ duration: reached("leaving") ? 0.75 : 1.2, ease: EASE }}
        style={{ perspective: 1300 }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ rotateX, rotateY }}
        >
          <div className={`relative h-full w-full ${phase === "sealed" ? "envelope-float" : ""}`}>
            <div className="absolute -bottom-9 left-[6%] right-[6%] h-10 rounded-[50%] bg-[#3a1a14]/35 blur-xl" />

            {/* Back of the envelope with a gilded lining */}
            <div
              className="absolute inset-0 rounded-[6px] shadow-[0_30px_50px_-22px_rgba(58,20,14,0.65)]"
              style={{ backgroundImage: PAPER, backgroundSize: "300px 300px" }}
            >
              <div className="gilt-lining absolute inset-[3px] rounded-[4px]" />
            </div>

            {/* The card tucked inside */}
            <motion.div
              className="paper-white absolute left-[6%] right-[6%] top-[6%] z-10 flex h-[88%] flex-col items-center rounded-[4px] px-3 pt-[3%] text-center shadow-[0_0_24px_rgba(0,0,0,0.4)]"
              animate={{ y: reached("rising") ? "-70%" : "0%" }}
              transition={{ duration: 1.45, ease: EASE }}
            >
              <div className="pointer-events-none absolute inset-2 border border-[#b8934a]/70" />
              <div className="pointer-events-none absolute inset-[11px] border border-[#b8934a]/35" />
              <div className="relative h-[55%] w-full mix-blend-multiply">
                <Image src={ART.couple.src} alt="" fill sizes="400px" preload className="object-contain" />
              </div>
              <p className="foil-text-deep px-2 font-script text-[clamp(1.5rem,7vw,2.3rem)] leading-tight">
                {first(brideName)} &amp; {first(groomName)}
              </p>
              <p className="font-cormorant text-sm italic text-[#5a3a30]">{dateLabel}</p>
            </motion.div>

            {/* Front pocket */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <Panel
                clip="polygon(0 0, 52% 54%, 0 100%)"
                shade="linear-gradient(100deg, rgba(255,190,170,0.1), rgba(0,0,0,0.32))"
                edge="0,0 52,54 0,100"
              />
              <Panel
                clip="polygon(100% 0, 48% 54%, 100% 100%)"
                shade="linear-gradient(260deg, rgba(0,0,0,0.04), rgba(0,0,0,0.38))"
                edge="100,0 48,54 100,100"
              />
              <Panel
                clip="polygon(0 100%, 46% 49%, 50% 46.5%, 54% 49%, 100% 100%)"
                shade="linear-gradient(0deg, rgba(0,0,0,0.3), rgba(255,200,180,0.09))"
                edge="0,100 46,49 50,46.5 54,49 100,100"
              />
            </div>

            {/* Top flap, hinged along the upper edge */}
            <motion.div
              className={`pointer-events-none absolute inset-x-0 top-0 h-[63%] ${flapBehind ? "z-[5]" : "z-30"}`}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d", transformPerspective: 1300 }}
              animate={{ rotateX: reached("unfolding") ? 180 : 0 }}
              transition={{ duration: 1.05, ease: [0.65, 0, 0.35, 1] }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>
                <Panel
                  clip={FLAP_OUTER}
                  shade="linear-gradient(180deg, rgba(255,200,180,0.13), rgba(0,0,0,0.22))"
                  edge="0,0 45,94 48,98.6 50,100 52,98.6 55,94 100,0"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
              >
                <div className="gilt-lining absolute inset-0" style={{ clipPath: FLAP_INNER }} />
              </div>
            </motion.div>

            {/* Wax seal */}
            <button
              ref={sealRef}
              type="button"
              onClick={open}
              disabled={phase !== "sealed"}
              aria-label="Break the seal and open your invitation"
              className="group absolute left-1/2 top-[62%] z-40 aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-offset-4 disabled:pointer-events-none"
            >
              {phase === "sealed" && <span className="seal-halo absolute inset-[4%] rounded-full" />}
              <motion.span
                className="absolute inset-0 block"
                animate={phase === "cracking" ? { scale: [1, 0.9, 1.07, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {SEAL_HALVES.map((half, i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 block transition-[filter] group-hover:brightness-110"
                    animate={
                      reached("unfolding")
                        ? { ...half.exit, opacity: 0 }
                        : { x: "0%", y: "0%", rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.85, ease: "easeIn" }}
                    style={{ filter: "drop-shadow(0 6px 7px rgba(0,0,0,0.55))" }}
                  >
                    <span className="absolute inset-0 block" style={{ clipPath: half.clip }}>
                      <Image src="/images/textures/wax-seal.webp" alt="" fill sizes="140px" preload />
                    </span>
                  </motion.span>
                ))}
                {phase === "sealed" && <span className="seal-glint absolute inset-0" />}
              </motion.span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mt-14 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: phase === "sealed" ? 1 : 0, y: 0 }}
        transition={{ duration: 0.7, delay: phase === "sealed" ? 0.5 : 0, ease: EASE }}
      >
        <p className="font-cinzel text-[10px] font-semibold uppercase tracking-[0.4em] text-[#8a6425]">
          Specially prepared for
        </p>
        <p className="mt-1 px-3 py-1 font-script text-3xl leading-snug text-[#6d1a30] sm:text-4xl">
          {guestName}
        </p>
        <button
          type="button"
          onClick={open}
          disabled={phase !== "sealed"}
          className="btn-wine mt-4"
        >
          <span className="animate-pulse">Tap the seal to open</span>
        </button>
        <p className="mt-2 font-sinhala text-xs text-[#7b263a]">
          විවෘත කිරීමට මුද්‍රාව ඔබන්න
        </p>
      </motion.div>

      {/* Warm light that turns into the next sheet of paper */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#ffffff_0%,#fbf6ea_45%,#f6e8c6_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: reached("leaving") ? 1 : 0 }}
        transition={{ duration: 0.7 }}
      />
    </motion.div>
  );
}
