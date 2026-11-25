"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Flower2, Shirt, UtensilsCrossed } from "lucide-react";
import { ART, EASE, Illustration, Reveal, SectionHeading } from "./shared";

export function Ceremony({
  dateLabel,
  poruwaTime,
  receptionTime,
  dressCode,
}: {
  dateLabel: string;
  poruwaTime: string;
  receptionTime: string;
  dressCode?: string;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 85%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  const events = [
    {
      icon: Flower2,
      sinhala: "පෝරුවේ චාරිත්‍රය",
      title: "Poruwa Ceremony",
      detail: poruwaTime,
      note: "At the auspicious time",
    },
    {
      icon: UtensilsCrossed,
      sinhala: "මංගල සංග්‍රහය",
      title: "Reception",
      detail: receptionTime,
      note: "Celebrations & lunch",
    },
    ...(dressCode
      ? [
          {
            icon: Shirt,
            sinhala: "ඇඳුම්",
            title: "Dress Code",
            detail: dressCode,
            note: "Come dressed to celebrate",
          },
        ]
      : []),
  ];

  return (
    <section className="paper-ivory relative px-4 py-24 text-[#3a241c] sm:py-32">
      <SectionHeading sinhala="මංගල උත්සවය" title="The Celebration" tone="light" />
      <Reveal delay={0.1}>
        <p className="mt-4 text-center font-cormorant text-2xl italic text-[#7b263a]">{dateLabel}</p>
      </Reveal>

      <div className="mx-auto mt-8 grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <Illustration
          art={ART.poruwa}
          sizes="(min-width: 1024px) 480px, 100vw"
          className="mx-auto w-full max-w-[520px]"
        />

        <ol ref={listRef} className="relative mx-auto w-full max-w-md space-y-12">
          <span className="absolute bottom-6 left-7 top-6 w-px bg-[#b8934a]/25" aria-hidden="true" />
          <motion.span
            className="absolute bottom-6 left-7 top-6 w-px origin-top bg-gradient-to-b from-[#c9a45c] to-[#7b263a]"
            style={{ scaleY: lineScale }}
            aria-hidden="true"
          />
          {events.map(({ icon: Icon, sinhala, title, detail, note }, i) => (
            <motion.li
              key={title}
              className="relative flex items-start gap-5"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
            >
              <motion.span
                className="medallion relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                initial={{ scale: 0, rotate: -120 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
              >
                <Icon className="h-6 w-6 text-[#4a1220]" />
              </motion.span>
              <div className="pt-0.5">
                <p className="font-sinhala text-sm font-semibold text-[#7b263a]">{sinhala}</p>
                <h3 className="font-cinzel text-lg uppercase tracking-[0.14em]">{title}</h3>
                <p className="mt-1 font-cormorant text-2xl font-semibold leading-snug">{detail}</p>
                <p className="font-cormorant text-base italic text-[#8a6425]">{note}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
