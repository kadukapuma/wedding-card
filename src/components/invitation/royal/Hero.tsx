"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ART, EASE, Photo } from "./shared";

/** Script lettering that is revealed left to right, as if being written. */
function Written({
  children,
  delay,
  duration = 1.5,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.span
      className={`block ${className}`}
      initial={{ clipPath: "inset(-30% 100% -30% 0%)" }}
      animate={{ clipPath: "inset(-30% 0% -30% 0%)" }}
      transition={{ duration, delay, ease: [0.45, 0, 0.3, 1] }}
    >
      {children}
    </motion.span>
  );
}

export function Hero({
  photo,
  brideName,
  groomName,
  dateLabel,
  venueName,
}: {
  /** The couple's own picture, if they've added one; the illustration otherwise. */
  photo?: string;
  brideName: string;
  groomName: string;
  dateLabel: string;
  venueName: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);

  const first = (name: string) => name.split(" ")[0];

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <header
      ref={ref}
      className="royal-hero relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 pb-14 pt-20 text-[#f8eed6] lg:flex-row lg:gap-16 lg:px-14 lg:py-10"
    >
      <div className="royal-hero-pattern absolute inset-0" aria-hidden="true" />
      <div className="royal-hero-halo absolute left-[12%] top-[12%] h-[66vw] max-h-[760px] w-[66vw] max-w-[760px] rounded-full" aria-hidden="true" />
      <div className="absolute inset-4 border border-[#d5b86a]/25 sm:inset-7" aria-hidden="true" />
      <div className="absolute inset-6 border border-[#d5b86a]/10 sm:inset-9" aria-hidden="true" />

      <p className="relative z-10 self-end pr-4 text-right font-cormorant text-lg italic leading-tight text-[#e9d59d] lg:absolute lg:right-24 lg:top-12 lg:text-2xl">
        <Written delay={1.2} duration={1.3}>
          <span className="font-script text-[1.9em] leading-none">T</span>rue love stories
        </Written>
        <Written delay={2.4} duration={1.3} className="pl-8">
          never have endings…
        </Written>
      </p>

      {/* Portrait */}
      {photo ? (
        <motion.div
          className="arch-frame relative my-5 aspect-[4/5] h-[46svh] max-w-[84vw] lg:h-[80svh]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
        >
          <div className="arch-window arch-always relative h-full w-full overflow-hidden">
            <div className="ken-burns absolute inset-0">
              <Photo
                src={photo}
                alt={`${brideName} and ${groomName}`}
                className="object-[50%_20%]"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="relative z-[1] -mb-2 mt-4 w-[min(96%,calc(58svh*0.67),430px)] drop-shadow-[0_32px_32px_rgba(0,0,0,0.5)] lg:mb-[-2.5rem] lg:mt-0 lg:w-[min(46vw,calc(94svh*0.67))]"
          style={{ y: artY }}
        >
          <motion.div
            initial={{ clipPath: "circle(0% at 55% 32%)", scale: 1.1 }}
            animate={{ clipPath: "circle(95% at 55% 32%)", scale: 1 }}
            transition={{ duration: 2.4, delay: 0.2, ease: EASE }}
          >
            <Image
              src={ART.couple.src}
              alt={ART.couple.alt}
              width={ART.couple.width}
              height={ART.couple.height}
              sizes="(min-width: 1024px) 48vw, 100vw"
              preload
              className="art-float h-auto w-full"
            />
          </motion.div>
        </motion.div>
      )}

      <motion.div className="relative z-10 mt-2 text-center lg:mt-0 lg:w-[40%] lg:text-left" style={{ y: textY }}>
        <motion.p
          {...fadeUp(0.8)}
          className="font-cinzel text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d8bc73] sm:text-xs"
        >
          Together with their families
        </motion.p>

        <h1 className="mt-3 text-[#fff7e5]">
          <Written
            delay={1.1}
            className="px-4 font-script text-[clamp(3.2rem,15vw,5.5rem)] leading-[1.1] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] lg:px-0 lg:text-[clamp(4rem,7vw,7.5rem)]"
          >
            {first(brideName)}
          </Written>
          <motion.span
            {...fadeUp(2)}
            className="-my-2 block font-script text-3xl text-[#d7b458] lg:ml-10 lg:text-5xl"
          >
            &amp;
          </motion.span>
          <Written
            delay={2.2}
            className="px-4 font-script text-[clamp(3.2rem,15vw,5.5rem)] leading-[1.1] drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)] lg:px-0 lg:text-[clamp(4rem,7vw,7.5rem)]"
          >
            {first(groomName)}
          </Written>
        </h1>

        <motion.div {...fadeUp(3.2)} className="mt-2">
          <div className="mx-auto h-px w-40 bg-gradient-to-r from-transparent via-[#d8bc73] to-transparent lg:mx-0" />
          <p className="mt-3 font-cinzel text-sm font-semibold uppercase tracking-[0.18em] sm:text-base">
            {dateLabel}
          </p>
          <p className="mt-1 px-4 font-cormorant text-lg italic text-[#e9d59d] lg:px-0">{venueName}</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-2 left-1/2 z-10 text-[#8a6425]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8, duration: 1 }}
        style={{ x: "-50%" }}
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <span className="font-cinzel text-[9px] uppercase tracking-[0.35em]">Scroll</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </header>
  );
}
