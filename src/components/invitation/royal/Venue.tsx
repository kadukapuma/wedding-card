"use client";

import React from "react";
import { motion } from "framer-motion";
import { CalendarPlus, MapPin, Navigation } from "lucide-react";
import { ART, Illustration, Reveal } from "./shared";

export function Venue({
  name,
  address,
  mapsUrl,
  calendarUrl,
}: {
  name: string;
  address: string;
  mapsUrl: string;
  calendarUrl: string;
}) {
  return (
    <section className="paper-white relative overflow-hidden px-4 pb-24 pt-20 text-center text-[#3a241c]">
      <Reveal>
        <motion.span
          className="medallion mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <MapPin className="h-6 w-6 text-[#4a1220]" />
        </motion.span>
        <p className="mt-4 font-sinhala text-sm font-semibold text-[#7b263a]">ස්ථානය</p>
      </Reveal>

      <Illustration
        art={ART.venue}
        sizes="(min-width: 900px) 860px, 100vw"
        className="mx-auto mt-2 w-full max-w-[860px]"
      />

      <Reveal className="relative mx-auto max-w-xl">
        <h2 className="font-cinzel text-2xl uppercase tracking-[0.1em] text-[#3a1a20] sm:text-3xl">
          {name}
        </h2>
        <p className="mt-2 font-cormorant text-xl italic text-[#7b263a]">{address}</p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-wine">
            <Navigation className="h-4 w-4" />
            Get Directions
          </a>
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
            <CalendarPlus className="h-4 w-4" />
            Add to Calendar
          </a>
        </div>
      </Reveal>
    </section>
  );
}
