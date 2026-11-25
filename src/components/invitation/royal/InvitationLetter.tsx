"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CornerFiligree, LotusMotif } from "@/components/invitation/TraditionalMotifs";
import { ART, EASE, Illustration, Ornament, Reveal } from "./shared";

const CORNERS = [
  ["top-left", "left-3 top-3"],
  ["top-right", "right-3 top-3"],
  ["bottom-left", "bottom-3 left-3"],
  ["bottom-right", "bottom-3 right-3"],
] as const;

/** The printed invitation card: cotton paper, gold foil, tilts under the cursor. */
export function InvitationLetter({
  guestName,
  brideName,
  groomName,
  message,
}: {
  guestName: string;
  brideName: string;
  groomName: string;
  message: string;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 110, damping: 20 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), spring);
  const sheenX = useTransform(px, [0, 1], ["10%", "90%"]);
  const sheenY = useTransform(py, [0, 1], ["10%", "90%"]);
  const sheen = useMotionTemplate`radial-gradient(420px circle at ${sheenX} ${sheenY}, rgba(255,244,200,0.55), transparent 60%)`;

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <section className="paper-maroon relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,190,120,0.18),transparent_55%),linear-gradient(to_bottom,#1a060b,transparent_18%,transparent_82%,#1a060b)]" />

      <div className="relative mx-auto max-w-xl [perspective:1400px]">
        <motion.div
          initial={{ opacity: 0, rotateX: 42, y: 90 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: EASE }}
          style={{ transformOrigin: "top center" }}
        >
          <motion.article
            style={{ rotateX, rotateY }}
            onPointerMove={(e) => {
              if (e.pointerType !== "mouse") return;
              const box = e.currentTarget.getBoundingClientRect();
              px.set((e.clientX - box.left) / box.width);
              py.set((e.clientY - box.top) / box.height);
            }}
            onPointerLeave={reset}
            className="paper-ivory card-shadow relative rounded-[6px] px-7 py-14 text-center text-[#3a241c] sm:px-14 sm:py-20"
          >
            <div className="foil-border pointer-events-none absolute inset-3 rounded-[3px]" />
            <div className="pointer-events-none absolute inset-[19px] rounded-[2px] border border-[#b8934a]/35" />
            {CORNERS.map(([position, place]) => (
              <div key={position} className={`pointer-events-none absolute ${place}`}>
                <CornerFiligree position={position} className="h-14 w-14 text-[#a8823a] sm:h-20 sm:w-20" />
              </div>
            ))}

            <Reveal>
              <LotusMotif className="mx-auto h-12 w-12 text-[#a8823a]" />
              <p className="mt-2 font-sinhala text-xl font-bold text-[#7b263a]">ආයුබෝවන්</p>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-7 font-cinzel text-[10px] uppercase tracking-[0.34em] text-[#8a6425]">
                With great pleasure we invite
              </p>
              <p className="mt-2 px-1 py-1 font-script text-4xl leading-snug text-[#7b263a] sm:text-5xl">
                {guestName}
              </p>
              <div className="mx-auto mt-1 h-px w-48 bg-gradient-to-r from-transparent via-[#a8823a] to-transparent" />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-sm font-cormorant text-xl italic leading-relaxed text-[#5a3a30]">
                {message}
              </p>
            </Reveal>

            <div className="mt-9">
              <Reveal>
                <h3 className="foil-text-deep font-cinzel text-2xl font-bold uppercase tracking-[0.08em] sm:text-3xl">
                  {brideName}
                </h3>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="py-1 font-script text-5xl text-[#a8823a]">&amp;</p>
              </Reveal>
              <Reveal delay={0.3}>
                <h3 className="foil-text-deep font-cinzel text-2xl font-bold uppercase tracking-[0.08em] sm:text-3xl">
                  {groomName}
                </h3>
              </Reveal>
            </div>

            <Illustration
              art={ART.hands}
              sizes="260px"
              className="mx-auto mt-4 w-full max-w-[260px]"
            />

            <Ornament className="mt-4" />
            <p className="mt-4 font-sinhala text-sm font-medium text-[#7b263a]">මංගල ආරාධනය</p>

            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[6px] mix-blend-soft-light"
              style={{ background: sheen }}
            />
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
