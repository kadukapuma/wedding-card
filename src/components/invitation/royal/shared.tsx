"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LotusMotif } from "@/components/invitation/TraditionalMotifs";

export const EASE = [0.16, 1, 0.3, 1] as const;

export interface Artwork {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Original AI-generated cartoon illustrations. Their paper is pure white, so
 * multiply blending dissolves it into whatever sheet they are placed on.
 */
export const ART = {
  couple: {
    src: "/images/art/kandyan/couple.webp",
    width: 1024,
    height: 1280,
    alt: "Illustration of a groom in Kandyan Mul Anduma beside his bride in an ivory osariya",
  },
  bride: {
    src: "/images/art/kandyan/bride.webp",
    width: 404,
    height: 614,
    alt: "Illustration of the smiling bride in her gold ornaments",
  },
  groom: {
    src: "/images/art/kandyan/groom.webp",
    width: 614,
    height: 691,
    alt: "Illustration of the groom in the traditional Kandyan Mul Anduma",
  },
  poruwa: {
    src: "/images/art/kandyan/poruwa.webp",
    width: 1024,
    height: 1024,
    alt: "Illustration of the couple holding hands on a flower-draped Poruwa",
  },
  venue: {
    src: "/images/art/kandyan/venue.webp",
    width: 1536,
    height: 1024,
    alt: "Watercolour of a seaside terrace at sunset",
  },
  walking: {
    src: "/images/art/kandyan/walking.webp",
    width: 1024,
    height: 1536,
    alt: "Illustration of the couple walking together among falling flowers",
  },
  hands: {
    src: "/images/art/kandyan/hands.webp",
    width: 1024,
    height: 1280,
    alt: "Illustration of the couple's hands with wedding rings above white roses",
  },
} satisfies Record<string, Artwork>;

/**
 * An illustration that washes onto the page like paint when scrolled to.
 * The blend mode sits on the outermost element: any transformed wrapper between
 * it and the paper would stop the white background from disappearing.
 */
export function Illustration({
  art,
  className = "",
  sizes = "100vw",
  float = false,
}: {
  art: Artwork;
  className?: string;
  sizes?: string;
  float?: boolean;
}) {
  return (
    <motion.div
      className={`mix-blend-multiply ${className}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        variants={{
          hidden: { clipPath: "circle(0% at 50% 45%)", scale: 1.08 },
          shown: { clipPath: "circle(90% at 50% 45%)", scale: 1 },
        }}
        transition={{ duration: 2, ease: EASE }}
      >
        <Image
          src={art.src}
          alt={art.alt}
          width={art.width}
          height={art.height}
          sizes={sizes}
          className={`h-auto w-full ${float ? "art-float" : ""}`}
        />
      </motion.div>
    </motion.div>
  );
}

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 34,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Gold rule that draws outwards from a lotus. */
export function Ornament({ className = "" }: { className?: string }) {
  const line = (side: "left" | "right") => (
    <motion.span
      className={`h-px w-16 sm:w-24 ${
        side === "left"
          ? "origin-right bg-gradient-to-l"
          : "origin-left bg-gradient-to-r"
      } from-[#c9a45c] to-transparent`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
    />
  );

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      {line("left")}
      <motion.span
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <LotusMotif className="h-7 w-7 text-[#c9a45c]" />
      </motion.span>
      {line("right")}
    </div>
  );
}

export function SectionHeading({
  sinhala,
  title,
  tone = "dark",
}: {
  sinhala: string;
  title: string;
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className="text-center">
      <p
        className={`font-sinhala text-sm font-semibold ${
          tone === "dark" ? "text-[#e2c47f]" : "text-[#7b263a]"
        }`}
      >
        {sinhala}
      </p>
      <h2
        className={`mt-2 font-cinzel text-2xl uppercase tracking-[0.18em] sm:text-3xl ${
          tone === "dark" ? "text-[#f8ecd2]" : "text-[#3a1a20]"
        }`}
      >
        {title}
      </h2>
      <Ornament className="mt-4" />
    </Reveal>
  );
}

/**
 * Fills its (positioned) parent. Bundled images go through the Next optimiser;
 * couple-supplied links and uploads (remote or data URLs) render directly.
 */
export function Photo({
  src,
  alt,
  sizes = "100vw",
  className = "",
  preload = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  preload?: boolean;
}) {
  if (src.startsWith("/")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 h-full w-full object-cover ${className}`}
    />
  );
}
