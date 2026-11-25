"use client";

import React, { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ceremonyTimestamp } from "@/lib/utils/wedding-date";
import { ART, Illustration, Reveal, SectionHeading } from "./shared";

const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
const clientNow = () => Math.floor(Date.now() / 1000) * 1000;
const serverNow = () => null;

/** One number on a split-flap card that rolls over when it changes. */
function FlipCard({ value, label, sinhala }: { value: string; label: string; sinhala: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flip-card relative h-[5.2rem] w-full overflow-hidden rounded-xl sm:h-28">
        <AnimatePresence initial={false}>
          <motion.span
            key={value}
            className="foil-text absolute inset-0 flex items-center justify-center font-cinzel text-3xl font-bold tabular-nums sm:text-5xl"
            initial={{ y: "-100%", rotateX: 75, opacity: 0 }}
            animate={{ y: "0%", rotateX: 0, opacity: 1 }}
            exit={{ y: "100%", rotateX: -75, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.3, 0.7, 0.2, 1] }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/60 shadow-[0_1px_0_rgba(255,220,160,0.15)]" />
      </div>
      <span className="mt-3 font-cinzel text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8a6425]">
        {label}
      </span>
      <span className="font-sinhala text-[11px] text-[#7b263a]">{sinhala}</span>
    </div>
  );
}

export function Countdown({ date, time }: { date: string; time?: string }) {
  const now = useSyncExternalStore(subscribe, clientNow, serverNow);
  const target = ceremonyTimestamp(date, time);

  const remaining = now === null || target === null ? null : target - now;
  const celebrated = remaining !== null && remaining <= 0;
  const units: [string, string, number][] = [
    ["Days", "දින", 86_400_000],
    ["Hours", "පැය", 3_600_000],
    ["Minutes", "මිනිත්තු", 60_000],
    ["Seconds", "තත්පර", 1000],
  ];

  let rest = Math.max(0, remaining ?? 0);

  return (
    <section className="paper-white relative overflow-hidden px-4 py-24 text-[#3a241c]">
      <span className="wash wash-gold left-[-15%] top-[10%]" aria-hidden="true" />
      <span className="wash wash-rose bottom-[5%] right-[-18%]" aria-hidden="true" />

      <SectionHeading
        sinhala="නැකත් වේලාව"
        title={celebrated ? "Just Married" : "Counting the Moments"}
        tone="light"
      />

      <Illustration
        art={ART.walking}
        sizes="(min-width: 640px) 380px, 80vw"
        className="mx-auto mt-4 w-full max-w-[380px]"
        float
      />

      {target !== null && (
        <Reveal delay={0.1} className="relative mx-auto max-w-2xl">
          {celebrated ? (
            <p className="mx-auto max-w-md text-center font-cormorant text-2xl italic leading-relaxed text-[#6d1a30]">
              The auspicious ceremony has been celebrated. May their journey together be filled with
              lifelong joy and harmony.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-5" role="timer">
              {units.map(([label, sinhala, size]) => {
                const amount = Math.floor(rest / size);
                rest -= amount * size;
                return (
                  <FlipCard
                    key={label}
                    label={label}
                    sinhala={sinhala}
                    value={remaining === null ? "––" : String(amount).padStart(2, "0")}
                  />
                );
              })}
            </div>
          )}
        </Reveal>
      )}
    </section>
  );
}
